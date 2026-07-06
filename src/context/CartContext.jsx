/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext()
const COUPONS = {
  MANGA10: 0.1,
  FENIX15: 0.15
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [coupon, setCoupon] = useState(null)

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id)

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setCoupon(null)
  }

  const applyCoupon = (code) => {
    const normalizedCode = code.trim().toUpperCase()
    const discountRate = COUPONS[normalizedCode]

    if (!discountRate) {
      return false
    }

    setCoupon({ code: normalizedCode, discountRate })
    return true
  }

  const removeCoupon = () => {
    setCoupon(null)
  }

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  const cartTotalBeforeDiscount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0)
  }, [cart])

  const discountAmount = useMemo(() => {
    if (!coupon) return 0
    return Math.round(cartTotalBeforeDiscount * coupon.discountRate)
  }, [cartTotalBeforeDiscount, coupon])

  const cartTotal = useMemo(() => {
    return Math.max(cartTotalBeforeDiscount - discountAmount, 0)
  }, [cartTotalBeforeDiscount, discountAmount])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        cartCount,
        cartTotalBeforeDiscount,
        discountAmount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
