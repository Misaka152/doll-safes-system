<template>
  <div class="product-card" @click="navigateToDetail">
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-badges">
        <span v-if="product.isNew" class="badge new-badge">新品</span>
        <span 
          v-if="hasDiscount" 
          class="badge discount-badge"
        >
          {{ discountPercentage }}% 优惠
        </span>
      </div>
      <div class="product-actions">
        <el-button 
          type="primary" 
          circle 
          @click.stop="toggleFavorite"
          class="favorite-btn"
          :class="{ 'is-favorite': isFavorited }"
        >
          <el-icon><Star v-if="!isFavorited" /><StarFilled v-else /></el-icon>
        </el-button>
        <el-button 
          type="primary" 
          circle 
          @click.stop="addToCart"
          :disabled="!product.stock || product.stock <= 0"
        >
          <el-icon><ShoppingCart /></el-icon>
        </el-button>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-rating">
        <el-rate 
          v-model="rating" 
          disabled 
          text-color="#ff69b4"
          :max="5"
          :colors="['#ffb6c1', '#ff9cc2', '#ff69b4']"
          void-color="#f5e9ff"
        />
        <span class="rating-count">({{ product.reviewCount || 0 }})</span>
      </div>
      <p class="product-description">{{ truncatedDescription }}</p>
      <div class="product-price-container">
        <span class="current-price">¥{{ (product.price || 0).toFixed(2) }}</span>
        <span v-if="hasDiscount" class="original-price">¥{{ (product.originalPrice || 0).toFixed(2) }}</span>
      </div>
      <div class="product-stock" v-if="product.stock !== undefined && product.stock <= 10">
        <span v-if="product.stock > 0" class="low-stock">
          仅剩 {{ product.stock }} 件
        </span>
        <span v-else class="out-of-stock">
          售罄
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import { useFavoritesStore } from '../../stores/favorites';
import { useUserStore } from '../../stores/user';
import { ElMessage } from 'element-plus';
import { ShoppingCart, Star, StarFilled } from '@element-plus/icons-vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

// 计算商品评分，确保有有效值
const rating = computed(() => {
  return typeof props.product.rating === 'number' ? props.product.rating : 0;
});

// 跳转到商品详情页
const navigateToDetail = () => {
  router.push(`/product/${props.product.id}`);
};

// 添加到购物车
const addToCart = (event) => {
  event.stopPropagation();
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录再添加商品到购物车',
      type: 'warning',
      duration: 2000
    });
    router.push({
      path: '/login',
      query: { redirect: `/product/${props.product.id}` }
    });
    return;
  }
  
  if (props.product.stock > 0) {
    cartStore.addToCart(props.product.id, 1);
    ElMessage({
      message: `${props.product.name} 已添加到购物车`,
      type: 'success',
      duration: 2000
    });
  } else {
    ElMessage({
      message: '抱歉，该商品已售罄',
      type: 'warning',
      duration: 2000
    });
  }
};

// 切换收藏状态
const toggleFavorite = (event) => {
  event.stopPropagation();
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录再收藏商品',
      type: 'warning',
      duration: 2000
    });
    router.push({
      path: '/login',
      query: { redirect: `/product/${props.product.id}` }
    });
    return;
  }
  
  const result = favoritesStore.toggleFavorite(props.product);
  
  if (result) {
    ElMessage({
      message: `${props.product.name} 已添加到收藏`,
      type: 'success',
      duration: 2000
    });
  } else {
    ElMessage({
      message: `${props.product.name} 已从收藏中移除`,
      type: 'info',
      duration: 2000
    });
  }
};

// 计算属性
const truncatedDescription = computed(() => {
  if (!props.product.description) return '';
  return props.product.description.length > 60 
    ? props.product.description.slice(0, 60) + '...' 
    : props.product.description;
});

const hasDiscount = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > props.product.price;
});

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0;
  
  const discount = ((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100;
  return Math.round(discount);
});

// 判断商品是否已收藏
const isFavorited = computed(() => {
  return favoritesStore.isInFavorites(props.product.id);
});
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 182, 193, 0.4);
}

.product-image-container {
  position: relative;
  padding-top: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.new-badge {
  background-color: #ff69b4;
}

.discount-badge {
  background-color: #ffb6c1;
  color: #333;
}

.product-actions {
  position: absolute;
  bottom: -40px;
  right: 12px;
  transition: bottom 0.3s;
  display: flex;
  gap: 8px;
}

.product-card:hover .product-actions {
  bottom: 12px;
}

.favorite-btn.is-favorite {
  background-color: #ff69b4;
  border-color: #ff69b4;
}

.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--neutral-800);
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.product-rating :deep(.el-rate__icon) {
  margin-right: 2px;
  font-size: 16px;
}

.rating-count {
  margin-left: 4px;
  font-size: 0.8rem;
  color: #b39eb5;
}

.product-description {
  font-size: 0.9rem;
  color: var(--neutral-600);
  margin-bottom: 12px;
  flex-grow: 1;
}

.product-price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff69b4;
}

.original-price {
  font-size: 0.9rem;
  color: var(--neutral-500);
  text-decoration: line-through;
}

.product-stock {
  font-size: 0.8rem;
}

.low-stock {
  color: var(--warning-color);
}

.out-of-stock {
  color: var(--error-color);
}
</style>