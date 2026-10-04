import type { AdminPurchaseRow } from '@/types/admin-purchases.types';
import type { PaymentStatus } from '@/types/developer-dashboard.types';

export type OrderStatus = PaymentStatus | 'UNPAID';

// Any successful payment makes the order paid; otherwise the latest attempt decides.
export const deriveOrderStatus = (payments: AdminPurchaseRow['payments']): OrderStatus =>
  payments.some((p) => p.status === 'SUCCESS') ? 'SUCCESS' : (payments[0]?.status ?? 'UNPAID');

export const formatMoney = (value: string | number, currency = 'BDT') =>
  `${currency} ${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const shortId = (id: string) => id.slice(0, 8).toUpperCase();
