import { readJson, storageKey, useStoredJson, writeJson } from '@/lib/storage';
import { useGetMyProfile } from '@/hooks/user.hook';
import type { CartItem } from '@/types/cart.types';

// There is no cart API: the cart is a list of assessments kept in localStorage, keyed per user so
// accounts sharing a browser never see each other's cart. Prices here are display-only; the
// backend recalculates the total when the order is created.
const cartKey = (userId: string) => storageKey('cart', userId);

export const useCart = () => {
  const { data: user } = useGetMyProfile();
  const key = user?.role === 'DEVELOPER' ? cartKey(user.id) : null;
  const items = useStoredJson<CartItem[]>(key) ?? [];

  // Always read the latest stored list so rapid add/remove calls don't overwrite each other.
  const update = (fn: (current: CartItem[]) => CartItem[]) => {
    if (!key) return;
    writeJson(key, fn(readJson<CartItem[]>(key) ?? []));
  };

  return {
    items,
    count: items.length,
    total: items.reduce((sum, item) => sum + Number(item.price), 0),
    // False for guests and non-developers, who can't buy.
    enabled: Boolean(key),
    has: (id: string) => items.some((item) => item.id === id),
    add: (item: Omit<CartItem, 'addedAt'>) =>
      update((current) =>
        current.some((i) => i.id === item.id) ? current : [...current, { ...item, addedAt: new Date().toISOString() }],
      ),
    remove: (ids: string | string[]) => {
      const drop = new Set(Array.isArray(ids) ? ids : [ids]);
      update((current) => current.filter((item) => !drop.has(item.id)));
    },
    clear: () => update(() => []),
  };
};
