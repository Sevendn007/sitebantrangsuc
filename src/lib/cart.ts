export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export const CART_KEY = "vk_cart_v2";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:change"));
}

function keyOf(i: Pick<CartItem, "id" | "size">) {
  return `${i.id}::${i.size || ""}`;
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const items = readCart();
  const existing = items.find((i) => keyOf(i) === keyOf(item));
  if (existing) existing.quantity += quantity;
  else items.push({ ...item, quantity });
  writeCart(items);
}

export function updateQuantity(id: string, size: string | undefined, quantity: number) {
  const items = readCart()
    .map((i) => (keyOf(i) === keyOf({ id, size }) ? { ...i, quantity: Math.max(1, quantity) } : i))
    .filter((i) => i.quantity > 0);
  writeCart(items);
}

export function removeFromCart(id: string, size: string | undefined) {
  writeCart(readCart().filter((i) => keyOf(i) !== keyOf({ id, size })));
}

export function clearCart() {
  writeCart([]);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
