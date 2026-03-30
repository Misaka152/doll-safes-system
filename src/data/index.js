// 导出所有模拟数据和函数
import { 
  users, 
  login 
} from './users';

import { 
  categories 
} from './categories';

import { 
  tags 
} from './tags';

import { 
  products, 
  getProducts, 
  getProductById, 
  getProductsByCategory,
  getNewProducts,
  getFeaturedProducts
} from './products';

import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from './cart';

import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  clearFavorites
} from './favorites';

// 用户模块
export const userApi = {
  login
};

// 产品模块
export const productApi = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getNewProducts,
  getFeaturedProducts
};

// 购物车模块
export const cartApi = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};

// 收藏夹模块
export const favoritesApi = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  clearFavorites
};

// 订单模块
export const orderApi = {
  // 获取用户订单
  getUserOrders: (userId) => {
    // 从localStorage获取订单
    const ordersData = localStorage.getItem(`orders_${userId}`);
    const orders = ordersData ? JSON.parse(ordersData) : [];
    return {
      code: 200,
      message: '获取订单成功',
      data: orders
    };
  },
  
  // 创建订单
  createOrder: (userId, cartItems, totalAmount, shippingAddress) => {
    const orderId = `ORD${Date.now()}`;
    const currentDate = new Date().toLocaleString();
    
    const newOrder = {
      id: orderId,
      userId,
      date: currentDate,
      items: cartItems,
      totalAmount,
      status: 'pending', // 待付款
      shippingAddress
    };
    
    // 获取现有订单
    const ordersData = localStorage.getItem(`orders_${userId}`);
    const orders = ordersData ? JSON.parse(ordersData) : [];
    
    // 添加新订单
    orders.unshift(newOrder);
    
    // 保存到localStorage
    localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
    
    return {
      code: 200,
      message: '订单创建成功',
      data: newOrder
    };
  },
  
  // 更新订单状态
  updateOrderStatus: (userId, orderId, status) => {
    // 获取现有订单
    const ordersData = localStorage.getItem(`orders_${userId}`);
    if (!ordersData) {
      return {
        code: 404,
        message: '未找到订单',
        data: null
      };
    }
    
    const orders = JSON.parse(ordersData);
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return {
        code: 404,
        message: '未找到指定订单',
        data: null
      };
    }
    
    // 更新状态
    orders[orderIndex].status = status;
    
    // 保存回localStorage
    localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
    
    return {
      code: 200,
      message: '订单状态已更新',
      data: orders[orderIndex]
    };
  },
  
  // 删除订单
  deleteOrder: (userId, orderId) => {
    // 获取现有订单
    const ordersData = localStorage.getItem(`orders_${userId}`);
    if (!ordersData) {
      return {
        code: 404,
        message: '未找到订单',
        data: null
      };
    }
    
    const orders = JSON.parse(ordersData);
    const filteredOrders = orders.filter(order => order.id !== orderId);
    
    // 保存回localStorage
    localStorage.setItem(`orders_${userId}`, JSON.stringify(filteredOrders));
    
    return {
      code: 200,
      message: '订单已删除',
      data: filteredOrders
    };
  }
};

// 数据集合，方便调试
export const mockData = {
  users,
  categories,
  tags,
  products
};