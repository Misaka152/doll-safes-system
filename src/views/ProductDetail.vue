<template>
  <div class="product-detail-page" v-if="!isLoading && !productStore.productLoading && product">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-dolls">
        <div class="doll doll-1"></div>
        <div class="doll doll-2"></div>
        <div class="doll doll-3"></div>
        <div class="doll doll-4"></div>
        <div class="doll doll-5"></div>
      </div>
    </div>
    
    <div class="container">
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">全部商品</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/products?category=${product.category}` }">
            {{ product.category }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <div class="product-main-container">
        <div class="product-content">
          <!-- 产品图片 -->
          <div class="product-images">
            <div class="main-image-container">
              <img :src="selectedImage" :alt="product.name" class="main-image" />
            </div>
            <div class="thumbnail-container">
              <div 
                v-for="(image, index) in product.images" 
                :key="index" 
                class="thumbnail" 
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
              >
                <img :src="image" :alt="`${product.name} - 图片 ${index + 1}`" />
              </div>
            </div>
          </div>
          
          <!-- 产品信息 -->
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            
            <div class="product-meta">
              <div class="product-rating">
                <el-rate v-model="product.rating" disabled show-score text-color="#ff69b4" :colors="['#ffb6c1', '#ff9cc2', '#ff69b4']"/>
                <span class="review-count">{{ product.reviewCount }} 条评价</span>
              </div>
              
              <div class="product-badges">
                <el-tag v-if="product.isNew" class="cute-tag new-tag" type="danger" effect="plain" size="small">新品</el-tag>
                <el-tag v-if="hasDiscount" class="cute-tag discount-tag" type="warning" effect="plain" size="small">
                  优惠 {{ discountPercentage }}%
                </el-tag>
              </div>
            </div>
            
            <div class="product-price">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span v-if="hasDiscount" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-stock">
              <el-tag 
                class="cute-tag"
                :type="product.stock > 10 ? 'success' : (product.stock > 0 ? 'warning' : 'danger')"
                effect="light"
              >
                {{ stockStatusText }}
              </el-tag>
            </div>
            
            <el-divider />
            
            <div class="product-actions">
              <div class="quantity-selector">
                <el-input-number 
                  v-model="quantity" 
                  :min="1" 
                  :max="product.stock" 
                  :disabled="product.stock === 0"
                  class="cute-input-number"
                />
              </div>
              
              <div class="action-buttons">
                <el-button 
                  type="primary" 
                  size="large" 
                  @click="addToCart" 
                  :disabled="product.stock === 0"
                  class="cute-button cart-button"
                >
                  加入购物车
                </el-button>
                
                <el-button 
                  size="large" 
                  @click="toggleFavorite"
                  class="cute-button-outline favorite-button"
                  :class="{'is-favorite': isFavorite}"
                >
                  <el-icon class="favorite-icon">
                    <star-filled v-if="isFavorite" />
                    <star v-else />
                  </el-icon>
                  {{ isFavorite ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
            
            <!-- 标签和分类 -->
            <div class="product-tags">
              <span class="tag-label">标签：</span>
              <el-tag 
                v-for="tag in product.tags" 
                :key="tag" 
                effect="plain" 
                size="small" 
                class="product-tag cute-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            
            <div class="product-category">
              <span class="category-label">分类：</span>
              <router-link :to="`/products?category=${product.category}`" class="category-link">
                {{ product.category }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 产品详细信息 -->
      <div class="product-details-container">
        <div class="product-details">
          <el-tabs v-model="activeTab" class="cute-tabs">
            <el-tab-pane label="产品详情" name="details">
              <div class="details-content">
                <h3>产品详情</h3>
                <p>{{ product.longDescription }}</p>
                
                <div class="details-specs">
                  <h4>规格参数</h4>
                  <ul class="specs-list">
                    <li><strong>材质：</strong>优质PP棉 + 短毛绒</li>
                    <li><strong>尺寸：</strong>30 x 25 x 15 cm</li>
                    <li><strong>重量：</strong>约 300g</li>
                    <li><strong>适用年龄：</strong>3岁以上</li>
                    <li><strong>产地：</strong>中国</li>
                  </ul>
                </div>
                
                <div class="details-care">
                  <h4>保养说明</h4>
                  <ul class="care-list">
                    <li>建议手洗，温水轻柔清洗</li>
                    <li>请勿暴晒，避免长时间放置在潮湿环境</li>
                    <li>请勿使用漂白剂或强力洗涤剂</li>
                    <li>自然晾干，请勿使用烘干机</li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="用户评价" name="reviews">
              <div class="reviews-content">
                <div class="reviews-summary">
                  <div class="rating-overview">
                    <div class="average-rating">
                      <span class="rating-number">{{ product.rating.toFixed(1) }}</span>
                      <el-rate v-model="product.rating" disabled text-color="#ff69b4" :colors="['#ffb6c1', '#ff9cc2', '#ff69b4']" />
                      <span class="rating-count">{{ product.reviewCount }} 条评价</span>
                    </div>
                  </div>
                </div>
                
                <div class="reviews-list">
                  <div v-for="(review, index) in mockReviews" :key="index" class="review-item">
                    <div class="review-header">
                      <div class="reviewer-info">
                        <el-avatar :size="40" :style="{ backgroundColor: '#ffb6c1', color: 'white' }">{{ review.user.charAt(0) }}</el-avatar>
                        <div class="reviewer-meta">
                          <div class="reviewer-name">{{ review.user }}</div>
                          <div class="review-date">{{ review.date }}</div>
                        </div>
                      </div>
                      <div class="review-rating">
                        <el-rate v-model="review.rating" disabled text-color="#ff69b4" :colors="['#ffb6c1', '#ff9cc2', '#ff69b4']" />
                      </div>
                    </div>
                    <div class="review-content">{{ review.content }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="购买须知" name="guide">
              <div class="guide-content">
                <h3>购买须知</h3>
                
                <div class="guide-section">
                  <h4>发货和配送</h4>
                  <ul>
                    <li>订单确认后48小时内发货</li>
                    <li>全国大部分地区预计3-5个工作日送达</li>
                    <li>偏远地区可能需要额外1-3天配送时间</li>
                    <li>满199元享受免费配送服务</li>
                  </ul>
                </div>
                
                <div class="guide-section">
                  <h4>退换政策</h4>
                  <ul>
                    <li>商品签收后7天内，如有质量问题可申请退换</li>
                    <li>非质量问题退换需保持商品完好，包装未拆封</li>
                    <li>定制商品、特价商品等特殊商品可能不支持无理由退换</li>
                    <li>退换商品的邮费规则请参考具体商品说明</li>
                  </ul>
                </div>
                
                <div class="guide-section">
                  <h4>售后服务</h4>
                  <ul>
                    <li>商品自签收之日起30天内享受免费保修服务</li>
                    <li>如有任何问题，可通过客服电话、在线客服等渠道联系我们</li>
                    <li>客服热线：400-123-4567（周一至周日 9:00-21:00）</li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <!-- 相关推荐 -->
      <div class="related-products">
        <h2 class="section-title">相关推荐</h2>
        <div class="related-grid">
          <div v-for="product in relatedProducts" :key="product.id" class="related-item">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 加载状态 -->
  <div v-else-if="isLoading || productStore.productLoading" class="loading-state">
    <div class="container">
      <div class="loading-container">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 300px;">
                <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <el-skeleton-item variant="image" style="width: 80px; height: 80px;" />
                  <el-skeleton-item variant="image" style="width: 80px; height: 80px;" />
                  <el-skeleton-item variant="image" style="width: 80px; height: 80px;" />
                </div>
              </div>
              <div style="flex: 1; min-width: 300px;">
                <el-skeleton-item variant="h1" style="width: 50%;" />
                <div style="margin: 20px 0;">
                  <el-skeleton-item variant="text" style="width: 30%;" />
                </div>
                <div style="margin: 20px 0;">
                  <el-skeleton-item variant="h3" style="width: 25%;" />
                </div>
                <el-skeleton-item variant="text" style="width: 100%;" />
                <el-skeleton-item variant="text" style="width: 100%;" />
                <div style="margin: 30px 0;">
                  <el-skeleton-item variant="button" style="width: 30%; margin-right: 10px;" />
                  <el-skeleton-item variant="button" style="width: 45%;" />
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
  
  <!-- 错误状态 -->
  <div v-else-if="loadError || productStore.productError" class="error-state">
    <div class="container">
      <div class="error-container">
        <el-alert
          title="加载失败"
          type="error"
          :description="loadError || productStore.productError"
          show-icon
          :closable="false"
        >
          <template #default>
            <div class="error-actions">
              <el-button size="small" type="primary" @click="loadProductData()">
                重试
              </el-button>
              <el-button size="small" @click="router.push('/products')">
                返回商品列表
              </el-button>
            </div>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
  
  <!-- 商品不存在 -->
  <div v-else class="not-found-state container">
    <el-empty description="商品不存在或已下架">
      <template #extra>
        <el-button type="primary" @click="router.push('/products')">
          返回商品列表
        </el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useFavoritesStore } from '../stores/favorites';
import { useUserStore } from '../stores/user';
import ProductCard from '../components/product/ProductCard.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

// 获取商品ID
const productId = computed(() => route.params.id);

// 商品数据
const product = computed(() => {
  // 优先使用从API获取的单个产品详情
  if (productStore.currentProduct && productStore.currentProduct.id === parseInt(productId.value)) {
    return productStore.currentProduct;
  }
  // 如果没有详情数据，回退到产品列表中查找
  return productStore.getProduct(productId.value);
});

// 加载状态
const isLoading = ref(false);
const loadError = ref(null);

// 加载产品数据
const loadProductData = async () => {
  isLoading.value = true;
  loadError.value = null;
  
  try {
    // 直接调用API获取产品详情
    console.log('正在获取产品详情，ID:', productId.value);
    await productStore.fetchProductById(productId.value);
    
    // 获取产品后，检查是否存在
    if (!product.value) {
      console.error('找不到ID为', productId.value, '的产品');
      ElMessage.error('找不到该商品');
      router.push('/products');
    } else {
      console.log('成功获取产品详情:', product.value.name);
      // 设置选中图片
      if (product.value.images && product.value.images.length > 0) {
        selectedImage.value = product.value.images[0];
      } else if (product.value.image) {
        selectedImage.value = product.value.image;
      } else if (product.value.mainImage) {
        selectedImage.value = product.value.mainImage;
      }
    }
  } catch (err) {
    console.error('加载产品数据出错:', err);
    loadError.value = '加载商品详情失败，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 在组件挂载时加载产品数据
onMounted(() => {
  loadProductData();
});

// 选中的图片
const selectedImage = ref('');

// 购买数量
const quantity = ref(1);

// 是否收藏
const isFavorite = computed(() => {
  if (!product.value || !product.value.id) return false;
  return favoritesStore.isInFavorites(product.value.id);
});

// 当前活动的标签页
const activeTab = ref('details');

// 计算属性
const hasDiscount = computed(() => {
  if (!product.value) return false;
  return product.value.originalPrice && product.value.originalPrice > product.value.price;
});

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !product.value || !product.value.originalPrice || !product.value.price) return 0;
  
  const discount = ((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100;
  return Math.round(discount);
});

const stockStatusText = computed(() => {
  if (!product.value) return '';
  
  const stock = product.value.stock || 0;
  
  if (stock === 0) {
    return '暂无库存';
  } else if (stock <= 10) {
    return `库存紧张，仅剩 ${stock} 件`;
  } else {
    return '有库存';
  }
});

// 相关商品
const relatedProducts = computed(() => {
  if (!product.value) return [];
  
  return productStore.products
    .filter(p => {
      // 基本检查：ID不同
      if (p.id === product.value.id) return false;
      
      // 分类检查
      const categoryMatch = p.category === product.value.category;
      
      // 标签检查（添加防御性检查）
      let tagsMatch = false;
      if (Array.isArray(p.tags) && Array.isArray(product.value.tags)) {
        tagsMatch = p.tags.some(tag => product.value.tags.includes(tag));
      }
      
      return categoryMatch || tagsMatch;
    })
    .slice(0, 4);
});

// 模拟评价数据
const mockReviews = [
  {
    user: '李小明',
    date: '2025-03-15',
    rating: 5,
    content: '质量超级好，手感柔软舒适，做工精细，非常满意！包装也很精美，收到就给女儿了，她非常喜欢。以后还会继续支持的！'
  },
  {
    user: '张小红',
    date: '2025-03-10',
    rating: 4,
    content: '玩偶很漂亮，比预想的要精致，但比想象中稍小一点。总体来说还是很满意的，女儿很喜欢。发货速度也很快。'
  },
  {
    user: '王大力',
    date: '2025-03-05',
    rating: 5,
    content: '买来送给女朋友的，她超级喜欢！做工非常精致，面料也很舒服，性价比很高。客服态度也很好，有问题都及时回复。'
  },
  {
    user: '陈小婷',
    date: '2025-02-28',
    rating: 4.5,
    content: '第二次购买了，一如既往的好质量。这次买的是送人，朋友收到也很喜欢。就是快递有点慢，等了好几天才收到。'
  }
];

// 方法
const addToCart = () => {
  if (!product.value || product.value.stock === 0) return;
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录再添加商品到购物车',
      type: 'warning',
      duration: 2000
    });
    router.push({
      path: '/login',
      query: { redirect: `/product/${product.value.id}` }
    });
    return;
  }
  
  // 添加到购物车，传递选择的数量
  cartStore.addToCart(product.value.id, quantity.value);
  
  ElMessage.success(`已将 ${quantity.value} 个 ${product.value.name} 添加到购物车`);
};

const toggleFavorite = () => {
  if (!product.value) return;
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录再收藏商品',
      type: 'warning',
      duration: 2000
    });
    router.push({
      path: '/login',
      query: { redirect: `/product/${product.value.id}` }
    });
    return;
  }
  
  const result = favoritesStore.toggleFavorite(product.value);
  
  if (result) {
    ElMessage({
      message: `已将 ${product.value.name} 添加到收藏夹`,
      type: 'success'
    });
  } else {
    ElMessage({
      message: `已将 ${product.value.name} 从收藏夹移除`,
      type: 'info'
    });
  }
};
</script>

<style scoped>
.product-detail-page {
  position: relative;
  padding: 24px 0;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
}

/* 动态背景 */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.floating-dolls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.doll {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.15;
  filter: blur(1px);
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.doll-1 {
  width: 120px;
  height: 120px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/O1CN01oXbUBU1f7GzJDYoKI_!!2218018093959-0-cib.310x310.jpg');
  top: 15%;
  left: 10%;
  animation-duration: 8s;
}

.doll-2 {
  width: 150px;
  height: 150px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/O1CN01TIsV0Z1IGDZvT0ldq_!!2678750865-0-cib.310x310.jpg');
  top: 60%;
  left: 15%;
  animation-duration: 12s;
}

.doll-3 {
  width: 100px;
  height: 100px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/O1CN013sX4Xs1IcerqnLkho_!!2216212680914-0-cib.310x310.jpg');
  top: 30%;
  right: 15%;
  animation-duration: 9s;
}

.doll-4 {
  width: 130px;
  height: 130px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/O1CN01IG6HVR26g4kjKWezu_!!2217498937690-0-cib.jpg');
  top: 70%;
  right: 10%;
  animation-duration: 11s;
}

.doll-5 {
  width: 110px;
  height: 110px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/2020/254/588/17981885452_874399895.jpg');
  top: 50%;
  left: 50%;
  animation-duration: 10s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.container {
  position: relative;
  z-index: 1;
}

.breadcrumb-container {
  margin-bottom: 24px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 16px;
  border-radius: 16px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.1);
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-main-container, 
.product-details-container {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  margin-bottom: 32px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  animation: container-appear 0.6s ease-out;
}

@keyframes container-appear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-content {
  display: flex;
  gap: 48px;
  margin-bottom: 24px;
}

/* 商品图片 */
.product-images {
  flex: 1;
  max-width: 500px;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.2);
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.main-image:hover {
  transform: scale(1.05);
}

.thumbnail-container {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  border: 2px solid transparent;
  box-shadow: 0 4px 8px rgba(255, 105, 180, 0.1);
}

.thumbnail:hover {
  opacity: 0.9;
  transform: translateY(-3px);
}

.thumbnail.active {
  opacity: 1;
  border-color: #ff69b4;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品信息 */
.product-info {
  flex: 1;
}

.product-name {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #654972;
  font-weight: 700;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
}

.review-count {
  margin-left: 8px;
  color: #b39eb5;
  font-size: 0.9rem;
}

.product-badges {
  display: flex;
  gap: 8px;
}

.cute-tag {
  border-radius: 20px;
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.new-tag {
  background-color: rgba(255, 105, 180, 0.1);
  border-color: #ff69b4;
  color: #ff69b4;
}

.discount-tag {
  background-color: rgba(255, 182, 193, 0.1);
  border-color: #ffb6c1;
  color: #ff6b6b;
}

.product-price {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #ff69b4;
}

.original-price {
  font-size: 1.2rem;
  color: #b39eb5;
  text-decoration: line-through;
}

.product-description {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #654972;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.product-stock {
  margin-bottom: 16px;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.cute-input-number :deep(.el-input-number__decrease),
.cute-input-number :deep(.el-input-number__increase) {
  background-color: #f5e9ff;
  color: #ff69b4;
  border-color: #ffb6c1;
}

.cute-input-number :deep(.el-input__inner) {
  border-color: #ffb6c1;
  color: #654972;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.cute-button {
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
  font-weight: 500;
}

.cute-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
}

.cute-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.4);
}

.cute-button-outline {
  border-radius: 50px;
  background: transparent;
  border: 2px solid #ff69b4;
  color: #ff69b4;
  transition: all 0.3s;
  font-weight: 500;
}

.cute-button-outline:hover {
  background-color: rgba(255, 105, 180, 0.1);
  transform: translateY(-2px);
  border-color: #ff5aab;
  color: #ff5aab;
}

.cute-button-outline.is-favorite {
  background-color: rgba(255, 105, 180, 0.1);
  border-color: #ff69b4;
  color: #ff69b4;
}

.product-tags,
.product-category {
  margin-top: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tag-label,
.category-label {
  margin-right: 8px;
  color: #654972;
}

.product-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  background-color: rgba(255, 182, 193, 0.1);
  border-color: #ffb6c1;
  color: #654972;
}

.category-link {
  color: #ff69b4;
  font-weight: 500;
  text-decoration: none;
  position: relative;
}

.category-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ff69b4;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.category-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 详细信息标签页 */
.product-details {
  margin-bottom: 20px;
}

.cute-tabs :deep(.el-tabs__header) {
  border-bottom-color: rgba(255, 182, 193, 0.3);
}

.cute-tabs :deep(.el-tabs__item) {
  color: #654972;
  font-weight: 500;
}

.cute-tabs :deep(.el-tabs__item.is-active) {
  color: #ff69b4;
}

.cute-tabs :deep(.el-tabs__active-bar) {
  background-color: #ff69b4;
}

.details-content,
.reviews-content,
.guide-content {
  padding: 24px 0;
}

.details-content h3,
.reviews-content h3,
.guide-content h3 {
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: #654972;
  position: relative;
  padding-bottom: 8px;
}

.details-content h3::after,
.reviews-content h3::after,
.guide-content h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border-radius: 3px;
}

.details-content h4,
.reviews-content h4,
.guide-content h4 {
  font-size: 1.1rem;
  margin: 24px 0 12px;
  color: #654972;
}

.details-content p,
.reviews-content p,
.guide-content p {
  line-height: 1.6;
  color: #654972;
  margin-bottom: 16px;
}

.specs-list,
.care-list {
  list-style-type: none;
  padding-left: 0;
}

.specs-list li,
.care-list li {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
  color: #654972;
}

.specs-list li:last-child,
.care-list li:last-child {
  border-bottom: none;
}

.specs-list li strong {
  color: #ff69b4;
}

/* 评价部分 */
.reviews-summary {
  margin-bottom: 32px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-number {
  font-size: 2rem;
  font-weight: bold;
  color: #ff69b4;
}

.review-item {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.05);
}

.review-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-meta {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: 500;
  color: #654972;
}

.review-date {
  font-size: 0.8rem;
  color: #b39eb5;
}

.review-content {
  line-height: 1.6;
  color: #654972;
}

/* 购买须知 */
.guide-section {
  margin-bottom: 24px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.guide-section ul {
  padding-left: 20px;
}

.guide-section li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #654972;
}

/* 相关推荐 */
.related-products {
  margin-top: 48px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  animation: container-appear 0.6s ease-out 0.3s both;
}

.section-title {
  font-size: 1.6rem;
  margin-bottom: 24px;
  color: #654972;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border-radius: 3px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.related-item {
  transition: transform 0.3s;
}

.related-item:hover {
  transform: translateY(-5px);
}

.loading-state, .error-state, .not-found-state {
  min-height: 60vh;
  padding: 24px 0;
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
}

.loading-container {
  padding: 48px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.error-container {
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.error-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.not-found-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .product-content {
    flex-direction: column;
    gap: 32px;
  }
  
  .product-images {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .product-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .product-name {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .product-main-container, 
  .product-details-container,
  .related-products,
  .loading-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .breadcrumb-container {
    padding: 10px;
  }
}
</style>