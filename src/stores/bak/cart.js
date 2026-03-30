import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 购物车商品列表
  const items = ref([])
  
  // 从本地存储恢复购物车数据
  const initCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      items.value = JSON.parse(storedCart)
    }
  }
  
  // 调用初始化
  initCartFromStorage()
  
  // 保存购物车到本地存储
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  // 计算属性
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })
  
  // 添加商品到购物车
  const addItem = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
    
    saveCart()
  }
  
  // 从购物车移除商品
  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }
  
  // 更新商品数量
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity) // 确保数量至少为1
      saveCart()
    }
  }
  
  // 清空购物车
  const clearCart = () => {
    items.value = []
    saveCart()
  }
  
  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})