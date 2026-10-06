import { deriveOrderStatus } from '@/components/modules/admin-purchases/purchase-utils';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-purchases.types';

export const customerName = (customer: EvaluatorPurchaseRow['customer']) =>
  customer.name ?? customer.email;

// Only orders without a successful payment can be repriced; editing a paid order would
// change reported revenue without changing what the customer was charged.
export const canAdjustPrice = (order: EvaluatorPurchaseRow) =>
  deriveOrderStatus(order.payments) !== 'SUCCESS';

// The backend doesn't expose the other evaluators' lines, only the difference.
export const otherItemsAmount = (order: EvaluatorPurchaseRow) =>
  Math.max(Number(order.price) - Number(order.subtotal), 0);
