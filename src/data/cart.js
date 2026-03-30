import { products } from './products';

// 本地存储键名
const CART_STORAGE_KEY = 'doll_ecommerce_cart';

// 从本地存储加载购物车
function loadCartFromStorage(userId) {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    // 检查是否有当前用户的购物车
    if (parsedCart[userId]) {
      return parsedCart[userId];
    }
  }
  return [];
}

// 保存购物车到本地存储
function saveCartToStorage(userId, cartItems) {
  let allCarts = {};
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart) {
    allCarts = JSON.parse(storedCart);
  }
  allCarts[userId] = cartItems;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(allCarts));
}

// 获取购物车内容
export function getCart(userId) {
  const cartItems = loadCartFromStorage(userId);
  
  // 计算商品详情和总价
  const cartWithDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      cartItemId: item.id,
      productId: item.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: item.quantity,
      totalPrice: product.price * item.quantity
    };
  });
  
  return {
    code: 200,
    message: '获取成功',
    data: cartWithDetails
  };
}

// 添加商品到购物车
export function addToCart(userId, productId, quantity) {
  const cartItems = loadCartFromStorage(userId);
  const product = products.find(p => p.id === Number(productId));
  
  if (!product) {
    return {
      code: 404,
      message: '商品不存在',
      data: null
    };
  }
  
  // 检查库存
  if (product.stock < quantity) {
    return {
      code: 400,
      message: '商品库存不足',
      data: null
    };
  }
  
  // 检查购物车中是否已存在该商品
  const existingItemIndex = cartItems.findIndex(item => item.productId === Number(productId));
  
  if (existingItemIndex >= 0) {
    // 更新数量
    cartItems[existingItemIndex].quantity += Number(quantity);
  } else {
    // 添加新项目
    cartItems.push({
      id: Date.now(), // 生成唯一ID
      productId: Number(productId),
      quantity: Number(quantity)
    });
  }
  
  // 保存到本地存储
  saveCartToStorage(userId, cartItems);
  
  return {
    code: 200,
    message: '添加成功',
    data: getCart(userId).data
  };
}

// 更新购物车商品数量
export function updateCartItemQuantity(userId, cartItemId, quantity) {
  const cartItems = loadCartFromStorage(userId);
  const itemIndex = cartItems.findIndex(item => item.id === Number(cartItemId));
  
  if (itemIndex < 0) {
    return {
      code: 404,
      message: '购物车项目不存在',
      data: null
    };
  }
  
  // 检查库存
  const productId = cartItems[itemIndex].productId;
  const product = products.find(p => p.id === productId);
  
  if (product.stock < quantity) {
    return {
      code: 400,
      message: '商品库存不足',
      data: null
    };
  }
  
  // 更新数量
  cartItems[itemIndex].quantity = Number(quantity);
  
  // 保存到本地存储
  saveCartToStorage(userId, cartItems);
  
  return {
    code: 200,
    message: '更新成功',
    data: getCart(userId).data
  };
}

// 从购物车删除商品
export function removeFromCart(userId, cartItemId) {
  let cartItems = loadCartFromStorage(userId);
  const itemIndex = cartItems.findIndex(item => item.id === Number(cartItemId));
  
  if (itemIndex < 0) {
    return {
      code: 404,
      message: '购物车项目不存在',
      data: null
    };
  }
  
  // 删除项目
  cartItems = cartItems.filter(item => item.id !== Number(cartItemId));
  
  // 保存到本地存储
  saveCartToStorage(userId, cartItems);
  
  return {
    code: 200,
    message: '删除成功',
    data: getCart(userId).data
  };
}

// 清空购物车
export function clearCart(userId) {
  saveCartToStorage(userId, []);
  
  return {
    code: 200,
    message: '购物车已清空',
    data: []
  };
}