import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { cartApi } from '../data'

export const useCartStore = defineStore('cart', () => {
  // 购物车状态
  const cartItems = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // 计算总价
  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
  })
  
  // 计算总数量
  const totalQuantity = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  // 获取当前用户ID
  const getCurrentUserId = () => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn || !userStore.user) {
      return 'guest'; // 未登录用户使用guest ID
    }
    return userStore.user.id
  }
  
  // 获取购物车
  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = cartApi.getCart(userId)
      if (response.code === 200) {
        cartItems.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = err.message || '获取购物车失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // 添加商品到购物车
  const addToCart = async (productId, quantity = 1) => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = cartApi.addToCart(userId, productId, quantity)
      if (response.code === 200) {
        cartItems.value = response.data
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '添加商品失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // 更新购物车商品数量
  const updateQuantity = async (cartItemId, quantity) => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = cartApi.updateCartItemQuantity(userId, cartItemId, quantity)
      if (response.code === 200) {
        cartItems.value = response.data
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '更新商品数量失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // 从购物车移除商品
  const removeFromCart = async (cartItemId) => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = cartApi.removeFromCart(userId, cartItemId)
      if (response.code === 200) {
        cartItems.value = response.data
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '移除商品失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // 清空购物车
  const clearCart = async () => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = cartApi.clearCart(userId)
      if (response.code === 200) {
        cartItems.value = []
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '清空购物车失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    cartItems,
    loading,
    error,
    totalPrice,
    totalQuantity,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
})