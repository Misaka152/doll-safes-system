import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { productApi, mockData } from '../data'

export const useProductStore = defineStore('products', () => {
  // 产品状态
  const products = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const categories = ref(mockData.categories.map(cat => cat.name))
  
  // 计算属性 - 精选产品
  const featuredProducts = computed(() => {
    return products.value.filter(p => p.isFeatured === true) || []
  })
  
  // 计算属性 - 新品
  const newProducts = computed(() => {
    return products.value.filter(p => p.isNew === true) || []
  })
  
  // 获取所有产品
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      // 使用模拟数据API
      const response = productApi.getProducts()
      products.value = response.data

      // 调试信息
      console.log('获取到产品数据:', response.data.length, '条记录')
      console.log('精选产品:', featuredProducts.value.length, '条记录')
      console.log('新品产品:', newProducts.value.length, '条记录')
    } catch (err) {
      error.value = '获取产品列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // 初始化时自动获取产品数据
  fetchProducts()
  
  // 获取单个产品详情
  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    currentProduct.value = null
    try {
      // 使用模拟数据API
      const response = productApi.getProductById(id)
      if (response.code === 200) {
        currentProduct.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = '获取产品详情失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // 从本地数据查找产品
  const getProduct = (id) => {
    const numericId = parseInt(id);
    return products.value.find(p => p.id === numericId) || null;
  }
  
  // 根据分类获取产品
  const fetchProductsByCategory = async (categoryId) => {
    loading.value = true
    error.value = null
    try {
      // 使用模拟数据API
      const response = productApi.getProductsByCategory(categoryId)
      products.value = response.data
    } catch (err) {
      error.value = '获取分类产品失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // 搜索产品
  const searchProducts = (query) => {
    if (!query || !query.trim()) {
      return products.value;
    }
    
    const searchTerm = query.trim().toLowerCase();
    return products.value.filter(product => {
      // 搜索名称
      if (product.name.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 搜索描述
      if (product.description && product.description.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 搜索分类
      if (product.category && product.category.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // 搜索标签
      if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      return false;
    });
  };
  
  // 获取新品
  const fetchNewProducts = async () => {
    loading.value = true
    error.value = null
    try {
      // 使用模拟数据API
      const response = productApi.getNewProducts()
      return response.data
    } catch (err) {
      error.value = '获取新品失败'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // 获取推荐产品
  const fetchFeaturedProducts = async () => {
    loading.value = true
    error.value = null
    try {
      // 使用模拟数据API
      const response = productApi.getFeaturedProducts()
      return response.data
    } catch (err) {
      error.value = '获取推荐产品失败'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  return {
    products,
    currentProduct,
    loading,
    error,
    categories,
    featuredProducts,
    newProducts,
    fetchProducts,
    fetchProductById,
    getProduct,
    fetchProductsByCategory,
    fetchNewProducts,
    fetchFeaturedProducts,
    searchProducts
  }
})