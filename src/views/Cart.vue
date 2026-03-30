<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>
      
      <div v-if="cartItems.length > 0" class="cart-content">
        <!-- 购物车列表 -->
        <div class="cart-items-container">
          <div class="cart-header">
            <div class="cart-header-item product-info">商品信息</div>
            <div class="cart-header-item product-price">单价</div>
            <div class="cart-header-item product-quantity">数量</div>
            <div class="cart-header-item product-total">小计</div>
            <div class="cart-header-item product-action">操作</div>
          </div>
          
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
              <div class="product-info">
                <div class="product-image">
                  <img :src="item.image" :alt="item.name" />
                </div>
                <div class="product-details">
                  <router-link :to="`/product/${item.productId}`" class="product-name">
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
              
              <div class="product-price">
                ¥{{ item.price.toFixed(2) }}
              </div>
              
              <div class="product-quantity">
                <el-input-number 
                  v-model="item.quantity" 
                  :min="1" 
                  :max="100"
                  size="small"
                  @change="updateQuantity(item.cartItemId, item.quantity)"
                />
              </div>
              
              <div class="product-total">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
              
              <div class="product-action">
                <el-button 
                  type="danger" 
                  size="small" 
                  plain
                  @click="removeItem(item.cartItemId)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 购物车摘要 -->
        <div class="cart-summary">
          <div class="summary-header">
            <h3>订单摘要</h3>
          </div>
          
          <div class="summary-content">
            <div class="summary-row">
              <span>商品总数</span>
              <span>{{ cartTotalItems }} 件</span>
            </div>
            
            <div class="summary-row">
              <span>商品总价</span>
              <span>¥{{ cartTotalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="summary-row">
              <span>运费</span>
              <span>{{ shipping > 0 ? `¥${shipping.toFixed(2)}` : '免运费' }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>订单总计</span>
              <span class="total-price">¥{{ orderTotal.toFixed(2) }}</span>
            </div>
            
            <div class="coupon-input">
              <el-input 
                v-model="couponCode" 
                placeholder="输入优惠码" 
                class="coupon-code"
              >
                <template #append>
                  <el-button @click="applyCoupon">应用</el-button>
                </template>
              </el-input>
            </div>
            
            <el-button type="primary" class="checkout-button" @click="checkout">
              结算
            </el-button>
            
            <div class="continue-shopping">
              <router-link to="/products">
                <el-icon><el-icon-back /></el-icon>
                继续购物
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空购物车 -->
      <div v-else class="empty-cart">
        <el-empty description="您的购物车是空的">
          <router-link to="/products">
            <el-button type="primary">去购物</el-button>
          </router-link>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useUserStore } from '../stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '../data';

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

// 优惠码
const couponCode = ref('');
const appliedDiscount = ref(0);

// 运费计算
const shipping = computed(() => {
  const subtotal = cartTotalPrice.value;
  // 满199元免运费
  return subtotal >= 199 ? 0 : 10;
});

// 订单总价
const orderTotal = computed(() => {
  return cartTotalPrice.value + shipping.value - appliedDiscount.value;
});

// 购物车数据
const cartItems = computed(() => cartStore.cartItems);
const cartTotalItems = computed(() => cartStore.totalQuantity);
const cartTotalPrice = computed(() => cartStore.totalPrice);

// 更新商品数量
const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity);
};

// 移除商品
const removeItem = (productId) => {
  ElMessageBox.confirm(
    '确定要从购物车中删除此商品吗？',
    '删除商品',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      cartStore.removeFromCart(productId);
      ElMessage({
        type: 'success',
        message: '商品已从购物车中删除'
      });
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 应用优惠码
const applyCoupon = () => {
  if (!couponCode.value) {
    ElMessage.warning('请输入优惠码');
    return;
  }
  
  // 模拟优惠码验证和应用
  if (couponCode.value.toUpperCase() === 'WELCOME10') {
    // 10%折扣
    appliedDiscount.value = cartTotalPrice.value * 0.1;
    ElMessage.success('优惠码已应用，享受 10% 折扣');
  } else if (couponCode.value.toUpperCase() === 'FREESHIP') {
    // 免运费
    if (shipping.value > 0) {
      appliedDiscount.value = shipping.value;
      ElMessage.success('优惠码已应用，免运费');
    } else {
      ElMessage.info('您的订单已经享受免运费了');
    }
  } else {
    ElMessage.error('无效的优惠码');
  }
};

// 结算
const checkout = () => {
  if (!userStore.isLoggedIn) {
    ElMessageBox.confirm(
      '请先登录才能继续结算',
      '需要登录',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
      .then(() => {
        router.push({
          path: '/login',
          query: { redirect: '/cart' }
        });
      })
      .catch(() => {
        // 用户取消
      });
    return;
  }
  
  // 确认订单支付
  ElMessageBox.confirm(
    `您确定要支付 ¥${orderTotal.value.toFixed(2)} 完成订单吗？`,
    '确认订单',
    {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'success'
    }
  )
    .then(() => {
      // 创建订单
      const userId = userStore.user?.id || 'guest';
      const orderItems = cartItems.value.map(item => ({
        ...item,
        totalPrice: item.price * item.quantity
      }));
      
      // 假设地址已经设置好（实际应用中应该让用户选择或输入地址）
      const shippingAddress = {
        name: userStore.userName || '收货人',
        phone: '13800138000',
        address: '中国 上海市 浦东新区 某某路123号',
        zipCode: '200000'
      };
      
      // 调用API创建订单
      const result = orderApi.createOrder(
        userId, 
        orderItems, 
        orderTotal.value, 
        shippingAddress
      );
      
      if (result.code === 200) {
        // 清空购物车
        cartStore.clearCart();
        
        ElMessage.success('订单已创建，支付成功！');
        
        // 跳转到订单详情页或个人中心的订单页面
        router.push({
          path: '/profile',
          query: { tab: 'orders' }
        });
      } else {
        ElMessage.error(result.message || '创建订单失败');
      }
    })
    .catch(() => {
      // 用户取消支付
    });
};

// 初始化
onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
  min-height: calc(100vh - 300px);
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
}

.page-title {
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
  color: #ff69b4;
  text-align: center;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

/* 购物车列表样式 */
.cart-items-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  overflow: hidden;
}

.cart-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  padding: 16px;
  background-color: #ffeef5;
  font-weight: 600;
}

.cart-items {
  padding: 8px 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.product-name:hover {
  color: #ff69b4;
}

.product-price, .product-total {
  font-weight: 600;
  color: #ff69b4;
}

/* 购物车摘要样式 */
.cart-summary {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  position: sticky;
  top: 100px;
}

.summary-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #ff69b4;
}

.summary-content {
  padding: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 16px;
  color: #ff69b4;
}

.summary-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 16px 0;
}

.total-price {
  color: #ff69b4;
}

.coupon-input {
  margin: 16px 0;
}

.checkout-button {
  width: 100%;
  margin-top: 16px;
  height: 48px;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.continue-shopping {
  margin-top: 16px;
  text-align: center;
}

.continue-shopping a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.continue-shopping a:hover {
  color: #ff69b4;
}

/* 空购物车样式 */
.empty-cart {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  padding: 48px;
  text-align: center;
}
</style>