import { products } from './products';

// 本地存储键名
const FAVORITES_STORAGE_KEY = 'doll_ecommerce_favorites';

// 从本地存储加载收藏夹
function loadFavoritesFromStorage(userId) {
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (storedFavorites) {
    const parsedFavorites = JSON.parse(storedFavorites);
    // 检查是否有当前用户的收藏夹
    if (parsedFavorites[userId]) {
      return parsedFavorites[userId];
    }
  }
  return [];
}

// 保存收藏夹到本地存储
function saveFavoritesToStorage(userId, favoriteIds) {
  let allFavorites = {};
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (storedFavorites) {
    allFavorites = JSON.parse(storedFavorites);
  }
  allFavorites[userId] = favoriteIds;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
}

// 获取收藏夹内容
export function getFavorites(userId) {
  const favoriteIds = loadFavoritesFromStorage(userId);
  
  // 获取产品详情
  const favoriteProducts = favoriteIds.map(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      const { longDescription, images, tags, ...productData } = product;
      return productData;
    }
    return null;
  }).filter(product => product !== null);
  
  return {
    code: 200,
    message: '获取成功',
    data: favoriteProducts
  };
}

// 添加产品到收藏夹
export function addToFavorites(userId, productId) {
  const favoriteIds = loadFavoritesFromStorage(userId);
  const numericProductId = Number(productId);
  
  // 检查产品是否存在
  const product = products.find(p => p.id === numericProductId);
  if (!product) {
    return {
      code: 404,
      message: '商品不存在',
      data: null
    };
  }
  
  // 检查是否已在收藏夹中
  if (favoriteIds.includes(numericProductId)) {
    return {
      code: 400,
      message: '商品已在收藏夹中',
      data: null
    };
  }
  
  // 添加到收藏夹
  favoriteIds.push(numericProductId);
  saveFavoritesToStorage(userId, favoriteIds);
  
  return {
    code: 200,
    message: '添加成功',
    data: getFavorites(userId).data
  };
}

// 从收藏夹移除产品
export function removeFromFavorites(userId, productId) {
  let favoriteIds = loadFavoritesFromStorage(userId);
  const numericProductId = Number(productId);
  
  // 检查是否在收藏夹中
  if (!favoriteIds.includes(numericProductId)) {
    return {
      code: 400,
      message: '商品不在收藏夹中',
      data: null
    };
  }
  
  // 从收藏夹移除
  favoriteIds = favoriteIds.filter(id => id !== numericProductId);
  saveFavoritesToStorage(userId, favoriteIds);
  
  return {
    code: 200,
    message: '移除成功',
    data: getFavorites(userId).data
  };
}

// 检查产品是否在收藏夹中
export function isInFavorites(userId, productId) {
  const favoriteIds = loadFavoritesFromStorage(userId);
  return {
    code: 200,
    message: '获取成功',
    data: favoriteIds.includes(Number(productId))
  };
}

// 清空收藏夹
export function clearFavorites(userId) {
  saveFavoritesToStorage(userId, []);
  
  return {
    code: 200,
    message: '收藏夹已清空',
    data: []
  };
} 