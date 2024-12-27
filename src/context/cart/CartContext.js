import { createContext, useContext } from "react";

export const CartContext = createContext({
    cartItems: [],
    totalAmount: 0,
    btn: false,
    addItemToCart: () => { },
    setBtn: () => { },
    updateItemInCart: () => { },
    removeItemfromCart: () => { },
    clearCart: () => { }
});

export const useCart = () => useContext(CartContext);
