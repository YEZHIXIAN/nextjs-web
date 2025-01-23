import { create } from 'zustand';
import { persist } from "zustand/middleware";

export type Variant = {
  variantID : number,
  quantity : number
}

export type CartItem = {
  name : string,
  image : string,
  id : number,
  variant : Variant,
  price : number,
}

export type CartState = {
  cart : CartItem[],
  addToCart : (item : CartItem) => void,
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page",
  setCheckoutProgress: (val: "cart-page" | "payment-page" | "confirmation-page") => void,

}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
        cart: [],
        checkoutProgress: "cart-page",
        setCheckoutProgress:  (val) => set({ checkoutProgress: val }),
        addToCart: (item) => set(
          (state) => {

            const existingItem = state.cart.find(
              (cartItem) =>
                cartItem.id === item.id &&
                cartItem.variant.variantID === item.variant.variantID
            )

            if (existingItem) {
              const updatedCart = state.cart.map((cartItem) =>
                cartItem.id === item.id && cartItem.variant.variantID === item.variant.variantID
                  ? {
                    ...cartItem,
                    variant: {
                      ...cartItem.variant,
                      quantity: cartItem.variant.quantity + item.variant.quantity
                    }
                  }
                  : cartItem
              )
              return { cart: updatedCart.filter((item) => item.variant.quantity > 0) }
            } else {
              return { cart: [...state.cart, item] };
            }
          }
        ),
      }
    ),
    { name: "cart-store" }
  )
)


