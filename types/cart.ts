export type CartItemType = "masterclass" | "product";

export interface CartItem {
  type: CartItemType;
  /** Raw masterclass/product id (without "masterclass-" prefix) */
  id: string;
  title: { pl: string; en: string };
  price: number;
  quantity: number;
  /** Max free seats known at add time (for UI caps) */
  maxQuantity?: number;
  photo?: string;
}

export interface CartCheckoutItem {
  type: CartItemType;
  id: string;
  title: { pl: string; en: string };
  price: number;
  quantity: number;
}
