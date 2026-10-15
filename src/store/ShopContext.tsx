import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct, type Product, type ColorVariant } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, promoCodes } from '../data/commerce';

export interface CartLine {
  key: string;
  slug: string;
  color: string;
  size: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  variant: ColorVariant;
  lineTotal: number;
}

export interface Order {
  number: string;
  createdAt: string;
  email: string;
  name: string;
  address: string;
  shippingLabel: string;
  delivery: string;
  payment: string;
  lines: { name: string; color: string; size: string; qty: number; price: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  points: number;
}

interface Toast {
  id: number;
  title: string;
  image?: string;
  action?: { label: string; to: string };
}

interface ShopState {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  discount: number;
  promo: string | null;
  freeShipRemaining: number;
  add: (slug: string, color: string, size: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  orders: Order[];
  addOrder: (o: Order) => void;
  points: number;
  toast: Toast | null;
  showToast: (t: Omit<Toast, 'id'>) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const Ctx = createContext<ShopState | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, [key, v]);
  return [v, setV] as const;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartLine[]>('norbys.cart', []);
  const [wishlist, setWishlist] = usePersisted<string[]>('norbys.wish', ['signature-hoodie', 'classic-cap']);
  const [orders, setOrders] = usePersisted<Order[]>('norbys.orders', []);
  const [promo, setPromo] = usePersisted<string | null>('norbys.promo', null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const lines = useMemo<ResolvedLine[]>(
    () =>
      cart.flatMap((l) => {
        const product = getProduct(l.slug);
        const variant = product?.colors.find((c) => c.name === l.color);
        if (!product || !variant) return [];
        return [{ ...l, product, variant, lineTotal: product.price * l.qty }];
      }),
    [cart],
  );

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const promoDef = promo ? promoCodes[promo] : undefined;
  const discount = promoDef?.percent ? Math.round(subtotal * promoDef.percent) / 100 : 0;

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToast({ ...t, id });
    window.setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 2600);
  }, []);

  const add = useCallback(
    (slug: string, color: string, size: string, qty = 1) => {
      const key = `${slug}|${color}|${size}`;
      setCart((c) => {
        const found = c.find((l) => l.key === key);
        if (found) return c.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
        return [...c, { key, slug, color, size, qty }];
      });
    },
    [setCart],
  );

  const value: ShopState = {
    lines,
    count,
    subtotal,
    discount,
    promo,
    freeShipRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    add,
    setQty: (key, qty) => setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l))),
    remove: (key) => setCart((c) => c.filter((l) => l.key !== key)),
    clear: () => {
      setCart([]);
      setPromo(null);
    },
    applyPromo: (code) => {
      const c = code.trim().toUpperCase();
      if (!promoCodes[c]) return false;
      setPromo(c);
      return true;
    },
    removePromo: () => setPromo(null),
    wishlist,
    toggleWish: (slug) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
    isWished: (slug) => wishlist.includes(slug),
    orders,
    addOrder: (o) => setOrders((all) => [o, ...all]),
    points: 250 + orders.reduce((s, o) => s + o.points, 0),
    toast,
    showToast,
    cartOpen,
    setCartOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShop must be used inside ShopProvider');
  return v;
}
