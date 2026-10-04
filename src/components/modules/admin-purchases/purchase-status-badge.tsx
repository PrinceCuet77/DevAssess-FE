import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/components/modules/admin-purchases/purchase-utils';

const STATUS: Record<
  OrderStatus,
  { label: string; variant: 'success' | 'warning' | 'secondary' | 'destructive' | 'outline' }
> = {
  SUCCESS: { label: 'Paid', variant: 'success' },
  PENDING: { label: 'Pending', variant: 'warning' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'secondary' },
  REFUNDED: { label: 'Refunded', variant: 'secondary' },
  UNPAID: { label: 'Unpaid', variant: 'outline' },
};

const PurchaseStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge variant={STATUS[status].variant}>{STATUS[status].label}</Badge>
);

export default PurchaseStatusBadge;
