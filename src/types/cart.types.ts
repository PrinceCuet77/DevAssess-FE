// A snapshot of the assessment taken when it was added, so the cart renders without refetching.
export type CartItem = {
  id: string;
  title: string;
  price: string;
  thumbnailUrl: string | null;
  tags: string[];
  duration: number;
  passingPercentage: number;
  creatorName: string;
  addedAt: string;
};
