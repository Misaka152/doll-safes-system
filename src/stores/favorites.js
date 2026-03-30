import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { favoritesApi } from '../data'

export const useFavoritesStore = defineStore('favorites', () => {
  // 收藏夹状态
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // 获取当前用户ID
  const getCurrentUserId = () => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn || !userStore.user) {
      return 'guest'; // 未登录用户使用guest ID
    }
    return userStore.user.id
  }
  
  // 从本地存储初始化收藏夹数据
  const initFavoritesFromStorage = () => {
    try {
      const userId = getCurrentUserId()
      fetchFavorites()
      return true
    } catch (err) {
      console.error('初始化收藏夹失败:', err)
      return false
    }
  }
  
  // 获取收藏夹
  const fetchFavorites = async () => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = favoritesApi.getFavorites(userId)
      if (response.code === 200) {
        favorites.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = err.message || '获取收藏夹失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // 添加商品到收藏夹
  const addToFavorites = async (productId) => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = favoritesApi.addToFavorites(userId, productId)
      if (response.code === 200) {
        favorites.value = response.data
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '添加到收藏夹失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // 从收藏夹移除商品
  const removeFromFavorites = async (productId) => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = favoritesApi.removeFromFavorites(userId, productId)
      if (response.code === 200) {
        favorites.value = response.data
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '从收藏夹移除失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // 切换商品收藏状态
  const toggleFavorite = (product) => {
    try {
      const userId = getCurrentUserId()
      const productId = product.id
      
      // 检查商品是否已收藏
      const inFavorites = isInFavorites(productId)
      
      // 根据当前状态执行添加或移除操作
      if (inFavorites) {
        const response = favoritesApi.removeFromFavorites(userId, productId)
        if (response.code === 200) {
          favorites.value = response.data
        }
        return false  // 返回false表示从收藏中移除
      } else {
        const response = favoritesApi.addToFavorites(userId, productId)
        if (response.code === 200) {
          favorites.value = response.data
        }
        return true   // 返回true表示添加到收藏
      }
    } catch (err) {
      console.error('切换收藏状态失败:', err)
      return false
    }
  }
  
  // 检查商品是否在收藏夹中
  const isInFavorites = (productId) => {
    try {
      const userId = getCurrentUserId()
      const response = favoritesApi.isInFavorites(userId, productId)
      return response.code === 200 && response.data === true
    } catch (err) {
      return false
    }
  }
  
  // 清空收藏夹
  const clearFavorites = async () => {
    loading.value = true
    error.value = null
    try {
      const userId = getCurrentUserId()
      const response = favoritesApi.clearFavorites(userId)
      if (response.code === 200) {
        favorites.value = []
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || '清空收藏夹失败'
      console.error(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    initFavoritesFromStorage,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isInFavorites,
    clearFavorites
  }
}) 