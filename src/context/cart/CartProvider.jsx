import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext.js";
import { useAuth } from "../AuthContext.js";
import Swal from "sweetalert2";
import { BASE_URL } from "../../conestans/baseUrl.jsx";

const CartProvider = ({ children }) => {
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [err, setErr] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }
        const fetchCart = async () => {
            const res = await fetch(`${BASE_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                setErr("faild to fetch ");
            }
            const cart = await res.json();
            const cartItemsMaped = cart.items.map(
                ({ product, quantity, unitPrice }) => ({
                    productId: product._id,
                    title: product.title,
                    image: product.image,
                    quantity,
                    unitPrice,
                })
            );
            setCartItems(cartItemsMaped);
            setTotalAmount(cart.totalAmount);
        };
        fetchCart();
    }, []);

    const addItemToCart = async (productId) => {
        setBtn(true)
        try {
            const res = await fetch(`${BASE_URL}/cart/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                }),
            });
            if (!res.ok) {
                setErr("faild to add product to cart");
                setBtn(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " item already exists",
                });
                return;
            }
            const cart = await res.json();
            // console.log(cart);
            if (!cart) {
                setErr("faield to parse cart");
                setBtn(false)
                return;
            }
            cart.items.map((it) => console.log(it))
            const cartItemsMaped = cart.items.map(({ product, quantity, unitPrice }) => ({
                productId: product._id,
                title: product.title,
                image: product.image,
                quantity,
                unitPrice
            }));
            // console.log(cartItemsMaped)
            setCartItems([...cartItemsMaped]);
            setTotalAmount(cart.totalAmount);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Item added Success",
                showConfirmButton: false,
                timer: 900
            });
            setBtn(false)
        } catch (err) {
            console.log(err);
            setBtn(false)
        }
        // console.log(productId);
    };
    const updateItemInCart = async (productId, quantity) => {

        try {
            const res = await fetch(`${BASE_URL}/cart/items`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });
            if (!res.ok) {
                setErr("faild to update product to cart")
            }
            const cart = await res.json();
            if (!cart) {
                setErr("faield to parse cart")
            }
            const cartItemsMaped = cart.items.map(({ product, quantity, unitPrice }) => ({ productId: product._id, title: product.title, image: product.image, quantity, unitPrice }))
            setCartItems([...cartItemsMaped]);
            setTotalAmount(cart.totalAmount);
            setBtn(false)
        } catch (err) {
            console.log(err)
        }
    }
    const removeItemfromCart = async (productId) => {
        try {
            const res = await fetch(`${BASE_URL}/cart/items/${productId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                setErr("faild to delete product from cart");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't Delete Item ",
                });
            }
            const cart = await res.json();
            if (!cart) {
                setErr("faield to parse cart")
            }
            const cartItemsMaped = cart.items.map(({ product, quantity, unitPrice }) => ({ productId: product._id, title: product.title, image: product.image, quantity, unitPrice }))
            setCartItems([...cartItemsMaped]);
            setTotalAmount(cart.totalAmount);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Item deleted Success",
                showConfirmButton: false,
                timer: 900
            });
        } catch (err) {
            console.log(err)
        }
    }
    const clearCart = async () => {
        try {
            const res = await fetch(`${BASE_URL}/cart`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                setErr("faild to clear products from cart");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't Clear Cart",
                });
            }
            const cart = await res.json();
            if (!cart) {
                setErr("faield to parse cart")
            }
            setCartItems([]);
            setTotalAmount(0);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Cart is Emty now ",
                showConfirmButton: false,
                timer: 1000
            });
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <CartContext.Provider value={{ addItemToCart, cartItems, totalAmount, btn, setBtn, updateItemInCart, removeItemfromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
export default CartProvider;
