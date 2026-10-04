import { deriveOrderStatus } from '@/components/modules/admin-purchases/purchase-utils';
import type { EvaluatorPurchaseRow } from '@/types/evaluator-assessments.types';

export type AssessmentSales = { purchases: number; revenue: number };

// An order with several of the evaluator's lines only reports the summed `subtotal`,
// so split it by current list price; single-line orders are exact.
export const orderAmountFor = (order: EvaluatorPurchaseRow, assessmentId: string) => {
  if (order.assessments.length <= 1) return Number(order.subtotal);
  const total = order.assessments.reduce((s, a) => s + Number(a.price), 0);
  const line = order.assessments.find((a) => a.id === assessmentId);
  if (!line) return 0;
  return total > 0 ? (Number(order.subtotal) * Number(line.price)) / total : 0;
};

// Only paid orders count as sales.
export const salesByAssessment = (orders: EvaluatorPurchaseRow[]) => {
  const map = new Map<string, AssessmentSales>();
  for (const order of orders) {
    if (deriveOrderStatus(order.payments) !== 'SUCCESS') continue;
    for (const a of order.assessments) {
      const cur = map.get(a.id) ?? { purchases: 0, revenue: 0 };
      cur.purchases += 1;
      cur.revenue += orderAmountFor(order, a.id);
      map.set(a.id, cur);
    }
  }
  return map;
};
