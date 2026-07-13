/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { getCouponByCode } from '../services/firebaseRest'

const CartContext = createContext()

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

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  const cartTotalBeforeDiscount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0)
  }, [cart])

  const applyCoupon = async (code) => {
    const normalizedCode = code.trim().toUpperCase()

    if (!normalizedCode) {
      return { ok: false, message: 'Ingresá un código de cupón.' }
    }

    try {
      const foundCoupon = await getCouponByCode(normalizedCode)

      if (!foundCoupon) {
        return { ok: false, message: 'El cupón ingresado no existe.' }
      }

      if (!foundCoupon.active) {
        return { ok: false, message: 'El cupón está desactivado.' }
      }

      const today = new Date().toISOString().slice(0, 10)
      if (foundCoupon.expirationDate && foundCoupon.expirationDate < today) {
        return { ok: false, message: 'El cupón está vencido.' }
      }

      if (cartTotalBeforeDiscount < Number(foundCoupon.minPurchase || 0)) {
        return {
          ok: false,
          message: `El cupón requiere una compra mínima de $${foundCoupon.minPurchase}.`
        }
      }

      setCoupon({
        ...foundCoupon,
        discountRate: Number(foundCoupon.percentage) / 100
      })

      return {
        ok: true,
        message: `Cupón ${foundCoupon.code} aplicado: ${foundCoupon.percentage}% de descuento.`
      }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
  }

  const couponStillEligible = useMemo(() => {
    if (!coupon) return false
    return cartTotalBeforeDiscount >= Number(coupon.minPurchase || 0)
  }, [cartTotalBeforeDiscount, coupon])

  const discountAmount = useMemo(() => {
    if (!coupon || !couponStillEligible) return 0
    return Math.round(cartTotalBeforeDiscount * coupon.discountRate)
  }, [cartTotalBeforeDiscount, coupon, couponStillEligible])

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
        couponStillEligible,
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
