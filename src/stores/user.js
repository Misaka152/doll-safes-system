import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '../data'
import { useCartStore } from './cart' // 添加购物车store引用

export const useUserStore = defineStore('user', () => {
  // 用户状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')
  
  // 从本地存储恢复用户数据
  const initUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      
      // 从localStorage检查并加载头像
      const savedAvatar = localStorage.getItem('userAvatar')
      if (savedAvatar && user.value) {
        user.value.avatar = savedAvatar
      }
    }
  }
  
  // 调用初始化
  initUserFromStorage()
  
  // 登录动作 - 允许任意用户名和密码
  const login = (email, password) => {
    // 参数验证
    if (!email || typeof email !== 'string') {
      return { success: false, message: '邮箱格式不正确' }
    }
    
    // 直接创建默认用户信息，无需验证
    const userData = {
      id: 1,
      name: email.split('@')[0] || '用户',  // 从邮箱地址提取用户名
      email: email,
      avatar: localStorage.getItem('userAvatar') || '/images/avater.png', // 使用本地头像或默认头像
      status: 'active'
    }
    
    // 更新用户信息
    user.value = userData
    token.value = 'mock-token-' + Date.now() // 模拟token
    
    // 保存到本地存储
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token.value)
    
    return { success: true, message: '登录成功' }
  }
  
  // 登出动作
  const logout = () => {
    // 清空购物车
    const cartStore = useCartStore()
    cartStore.clearCart()
    
    user.value = null
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // 不要删除头像，以便下次登录时使用
    // localStorage.removeItem('userAvatar')
  }
  
  // 更新用户信息
  const updateUser = (newUserData) => {
    user.value = { ...user.value, ...newUserData }
    
    // 如果更新了头像，存储到localStorage
    if (newUserData.avatar) {
      localStorage.setItem('userAvatar', newUserData.avatar)
    }
    
    localStorage.setItem('user', JSON.stringify(user.value))
  }
  
  return { 
    user, 
    token,
    isLoggedIn,
    userName,
    login,
    logout,
    updateUser
  }
})