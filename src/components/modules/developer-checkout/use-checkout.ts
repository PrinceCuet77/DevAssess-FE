import { useState } from 'react';
import { FetchError } from 'ofetch';
import { toast } from 'sonner';
import { useCreatePayment, useCreatePurchase } from '@/hooks';
import { getApiErrorMessage } from '@/lib/errors';
import type { DeveloperPurchase } from '@/types/developer-assessments.types';

type CheckoutItem = { id: string; title: string; price: string };

// The create-order errors name the offending assessments ("…: id1, id2" or "…: Title A, Title B").
// Work out which cart lines they refer to so the caller can drop them and let the user continue.
export const staleItemIds = (error: unknown, items: CheckoutItem[]): string[] => {
  if (!(error instanceof FetchError)) return [];
  const message = getApiErrorMessage(error, '');
  const list = message.slice(message.indexOf(':') + 1);
  if (error.status === 404 && message.startsWith('Assessment(s) not found')) {
    const ids = list.split(',').map((id) => id.trim());
    return items.filter((item) => ids.includes(item.id)).map((item) => item.id);
  }
  const byTitle =
    (error.status === 400 && message.startsWith('Assessment(s) not available')) ||
    (error.status === 409 && message.startsWith('You have already purchased'));
  return byTitle ? items.filter((item) => list.includes(item.title)).map((item) => item.id) : [];
};

type Options = {
  // Runs once the order exists, even if payment can't start: the order is safe in Purchases.
  onOrderCreated?: (order: DeveloperPurchase) => void;
  onStaleItems?: (ids: string[]) => void;
};

// Checkout = create the order, then start the payment. Creating an order charges nothing, and the
// server prices it from current prices, so if the total moved we stop and show it before paying.
export const useCheckout = ({ onOrderCreated, onStaleItems }: Options = {}) => {
  const purchase = useCreatePurchase();
  const payment = useCreatePayment();
  const [repriced, setRepriced] = useState<DeveloperPurchase | null>(null);

  const startPayment = (orderId: string) =>
    payment.mutate(orderId, {
      onSuccess: (res) => {
        window.location.href = res.data.gatewayPageURL;
      },
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Your order was created but payment could not start. Retry from Purchases.')),
    });

  const placeOrder = (items: CheckoutItem[]) => {
    const expected = items.reduce((sum, item) => sum + Number(item.price), 0);
    purchase.mutate(
      items.map((item) => item.id),
      {
        onSuccess: ({ data: order }) => {
          onOrderCreated?.(order);
          if (Math.abs(Number(order.price) - expected) > 0.001) {
            setRepriced(order);
            return;
          }
          startPayment(order.id);
        },
        onError: (err) => {
          const stale = staleItemIds(err, items);
          if (stale.length) onStaleItems?.(stale);
          toast.error(getApiErrorMessage(err, 'Could not create your order. Please try again.'), {
            description: stale.length ? 'We removed the unavailable items. You can continue with the rest.' : undefined,
          });
        },
      },
    );
  };

  return {
    placeOrder,
    // Stay busy through the gateway redirect so the order can't be placed twice.
    busy: purchase.isPending || payment.isPending || payment.isSuccess,
    stage: purchase.isPending ? 'creating' : payment.isPending || payment.isSuccess ? 'redirecting' : 'idle',
    repriced,
  } as const;
};
