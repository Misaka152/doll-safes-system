<template>
  <div class="home-page">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-dolls">
        <div class="doll doll-1"></div>
        <div class="doll doll-2"></div>
        <div class="doll doll-3"></div>
        <div class="doll doll-4"></div>
        <div class="doll doll-5"></div>
        <div class="doll doll-6"></div>
      </div>
    </div>
    
    <!-- 轮播图 -->
    <div class="hero-banner">
      <el-carousel height="500px" indicator-position="outside" arrow="always" :interval="3000">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2 class="banner-title">{{ banner.title }}</h2>
              <p class="banner-description">{{ banner.description }}</p>
              <el-button type="primary" size="large" class="cute-button" @click="navigateTo(banner.link)">
                {{ banner.buttonText }}
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="home-content">
      <!-- 特色分类 -->
      <section class="category-section container">
        <h2 class="section-title">玩偶分类</h2>
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category"
            class="category-card"
            @click="navigateToCategory(category)"
          >
            <div class="category-content">
              <h3 class="category-name">{{ category }}</h3>
              <el-button class="cute-button-outline" plain>查看全部</el-button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 精选产品 -->
      <section class="featured-section container">
        <div class="section-header">
          <h2 class="section-title">精选产品</h2>
          <router-link to="/products" class="view-all">
            查看全部 <el-icon><arrow-right /></el-icon>
          </router-link>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="loadError" class="error-container">
          <el-alert
            title="加载失败"
            type="error"
            :description="loadError"
            show-icon
            :closable="false"
          >
            <template #default>
              <div class="error-actions">
                <el-button size="small" type="primary" @click="productStore.fetchProducts()">
                  重试
                </el-button>
              </div>
            </template>
          </el-alert>
        </div>
        
        <div v-else-if="limitedFeaturedProducts.length === 0" class="no-products">
          暂无精选产品
        </div>
        
        <div v-else class="product-grid">
          <div v-for="product in limitedFeaturedProducts" :key="product.id" class="product-item">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>
      
      <!-- 新品上市 -->
      <section class="new-arrivals-section container">
        <div class="section-header">
          <h2 class="section-title">新品上市</h2>
          <router-link to="/products?new=true" class="view-all">
            查看全部 <el-icon><arrow-right /></el-icon>
          </router-link>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="loadError" class="error-container">
          <el-alert
            title="加载失败"
            type="error"
            :description="loadError"
            show-icon
            :closable="false"
          >
            <template #default>
              <div class="error-actions">
                <el-button size="small" type="primary" @click="productStore.fetchProducts()">
                  重试
                </el-button>
              </div>
            </template>
          </el-alert>
        </div>
        
        <div v-else-if="limitedNewProducts.length === 0" class="no-products">
          暂无新品上市
        </div>
        
        <div v-else class="product-grid">
          <div v-for="product in limitedNewProducts" :key="product.id" class="product-item">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>
      
      <!-- 品牌故事 -->
      <section class="brand-story-section">
        <div class="container">
          <div class="brand-story-content">
            <div class="brand-story-text">
              <h2 class="section-title">我们的故事</h2>
              <p class="brand-description">
                萌趣玩偶成立于2020年，致力于为玩偶爱好者提供高品质的收藏和陪伴玩偶。我们相信，每一个玩偶都有自己的灵魂和故事，能为人们带来快乐和温暖。
              </p>
              <p class="brand-description">
                我们的设计师团队来自全国各地，他们将传统手工艺与现代设计理念相结合，创造出既有艺术价值又充满情感的玩偶产品。
              </p>
              <el-button class="brand-story-button cute-button-outline">了解更多</el-button>
            </div>
            <div class="brand-story-image">
              <img src="https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="品牌故事" />
            </div>
          </div>
        </div>
      </section>
      
      <!-- 顾客评价 -->
      <section class="testimonial-section container">
        <h2 class="section-title">顾客评价</h2>
        <el-carousel :interval="4000" indicator-position="outside" type="card" height="280px">
          <el-carousel-item v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-card">
              <div class="testimonial-rating">
                <el-rate v-model="testimonial.rating" disabled show-score text-color="#ff69b4" />
              </div>
              <p class="testimonial-content">{{ testimonial.content }}</p>
              <div class="testimonial-author">
                <el-avatar :size="40" :style="{ backgroundColor: '#ffb6c1', color: 'white' }">{{ testimonial.author.charAt(0) }}</el-avatar>
                <div class="author-info">
                  <h4 class="author-name">{{ testimonial.author }}</h4>
                  <p class="author-title">{{ testimonial.title }}</p>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>
      
      <!-- 订阅通讯 -->
      <section class="newsletter-section">
        <div class="container">
          <div class="newsletter-content">
            <div class="newsletter-text">
              <h2 class="section-title">订阅我们的通讯</h2>
              <p>获取最新产品信息、优惠活动和独家折扣</p>
            </div>
            <div class="newsletter-form">
              <el-input 
                v-model="newsletter.email" 
                placeholder="请输入您的电子邮箱" 
                class="newsletter-input"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" class="cute-button" @click="subscribeNewsletter">订阅</el-button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/product/ProductCard.vue';
import { useProductStore } from '../stores/products';
import { ElMessage } from 'element-plus';
import { ArrowRight, Message } from '@element-plus/icons-vue'

const router = useRouter();
const productStore = useProductStore();

// 在组件挂载时获取产品数据
onMounted(async () => {
  console.log('Home组件挂载，加载产品数据');
  await productStore.fetchProducts();
  console.log('产品数据加载完成，总计:', productStore.products.length);
  console.log('精选产品:', productStore.featuredProducts.length);
  console.log('新品:', productStore.newProducts.length);
});

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '可爱治愈系列',
    description: '让柔软的玩偶治愈你的生活，送给每一个需要温暖的心灵',
    image: 'https://img.36krcdn.com/hsossms/20230801/v2_10d9992011844976b472d562b68ca47b@000000_oswg136099oswg1080oswg766_img_000',
    link: '/products?category=动物玩偶',
    buttonText: '立即选购'
  },
  {
    id: 2,
    title: '夏日限量款',
    description: '全新上市的夏日限量款玩偶，带给你清凉一夏的陪伴',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01iC4VQn1FSd8FSOtoL_!!6000000000486-0-cib.jpg',
    link: '/products?new=true',
    buttonText: '探索新品'
  },
  {
    id: 3,
    title: '收藏级精品',
    description: '为收藏家打造的限量版玩偶，精致做工，值得珍藏',
    image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.JWBh2wU-4SiIgCTpulheqAHaFj?cb=iwc1&rs=1&pid=ImgDetMain',
    link: '/products?category=收藏玩偶',
    buttonText: '查看收藏品'
  }
]);

// 顾客评价数据
const testimonials = ref([
  {
    id: 1,
    author: '王小明',
    title: '玩偶收藏家',
    rating: 5,
    content: '萌趣玩偶的质量远超我的期望！每个细节都处理得非常精致，面料柔软舒适，是我收藏中最喜欢的一款。'
  },
  {
    id: 2,
    author: '李小红',
    title: '礼品采购',
    rating: 4.5,
    content: '为女儿的生日购买了一只独角兽玩偶，她非常喜欢！包装精美，送货及时，是送礼的不二之选。'
  },
  {
    id: 3,
    author: '张小华',
    title: '室内设计师',
    rating: 5,
    content: '这些可爱的玩偶成为了我设计儿童房的绝佳装饰品，不仅质量好，色彩也非常丰富，为空间增添了活力。'
  },
  {
    id: 4,
    author: '陈小军',
    title: '忠实顾客',
    rating: 4.8,
    content: '已经在萌趣玩偶购买了三年，每次都能给我惊喜。他们的客服态度也非常好，有问题总是能及时解决。'
  }
]);

// 商品数据
const featuredProducts = computed(() => productStore.featuredProducts);
const newProducts = computed(() => productStore.newProducts);
const categories = computed(() => productStore.categories);

// 加载状态
const isLoading = computed(() => productStore.loading);
const loadError = computed(() => productStore.error);

// 限制显示的商品数量为8个，并添加空值检查
const limitedFeaturedProducts = computed(() => {
  if (!featuredProducts.value || !Array.isArray(featuredProducts.value)) {
    console.log('featuredProducts不是一个数组:', featuredProducts.value);
    return [];
  }
  console.log('获取到featured产品数量:', featuredProducts.value.length);
  return featuredProducts.value.slice(0, 8);
});

const limitedNewProducts = computed(() => {
  if (!newProducts.value || !Array.isArray(newProducts.value)) {
    console.log('newProducts不是一个数组:', newProducts.value);
    return [];
  }
  console.log('获取到new产品数量:', newProducts.value.length);
  return newProducts.value.slice(0, 8);
});

// 路由跳转
const navigateTo = (link) => {
  router.push(link);
};

const navigateToCategory = (category) => {
  router.push({
    path: '/products',
    query: { category }
  });
};

// 订阅通讯
const newsletter = ref({
  email: ''
});

const subscribeNewsletter = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!newsletter.value.email) {
    ElMessage.warning('请输入您的电子邮箱');
    return;
  }
  
  if (!emailRegex.test(newsletter.value.email)) {
    ElMessage.error('请输入有效的电子邮箱地址');
    return;
  }
  
  ElMessage.success('订阅成功！感谢您的关注');
  newsletter.value.email = '';
};
</script>

<style scoped>
.home-page {
  position: relative;
  overflow-x: hidden;
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

.doll-6 {
  width: 140px;
  height: 140px;
  background-image: url('https://cbu01.alicdn.com/img/ibank/O1CN01e9PUN81dXiRmUjQIA_!!2211237063746-0-cib.jpg');
  bottom: 15%;
  right: 25%;
  animation-duration: 14s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 主内容区域 */
.home-content {
  position: relative;
  z-index: 1;
}

/* 轮播图 */
.hero-banner {
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
}

.hero-banner :deep(.el-carousel__container) {
  height: 500px;
  border-radius: 0 0 24px 24px;
  overflow: hidden;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%);
}

.banner-content {
  position: relative;
  color: white;
  max-width: 500px;
  padding: 0 48px;
  z-index: 1;
  animation: banner-content-appear 0.8s ease-out;
}

@keyframes banner-content-appear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-title {
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-description {
  font-size: 1.1rem;
  margin-bottom: 24px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 通用部分 */
.section-title {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #ff69b4;
  position: relative;
  padding-bottom: 8px;
  font-weight: 700;
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

section {
  padding: 60px 40px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.15);
  backdrop-filter: blur(5px);
  transition: transform 0.3s;
  animation: section-appear 0.6s ease-out;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}

@keyframes section-appear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff69b4;
  font-weight: 500;
  transition: all 0.3s;
}

.view-all:hover {
  gap: 8px;
  color: #ff1493;
}

/* 分类部分 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px;
}

.category-card {
  height: 150px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 2px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 6px 15px rgba(255, 105, 180, 0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 105, 180, 0.2);
  border-color: #ffb6c1;
}

.category-content {
  text-align: center;
  z-index: 1;
}

.category-name {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #654972;
  font-weight: 600;
}

/* 产品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
}

.product-item {
  transition: transform 0.3s;
}

.product-item:hover {
  transform: translateY(-8px);
}

/* 品牌故事 */
.brand-story-section {
  background: linear-gradient(45deg, rgba(255, 105, 180, 0.85), rgba(255, 182, 193, 0.85));
  color: white;
  margin-bottom: 32px;
  border-radius: 24px;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.25);
}

.brand-story-section .section-title {
  color: white;
}

.brand-story-section .section-title::after {
  background: white;
}

.brand-story-content {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 20px 0;
}

.brand-story-text {
  flex: 1;
}

.brand-description {
  margin-bottom: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.brand-story-button {
  margin-top: 10px;
}

/* 修改品牌故事部分的按钮样式 */
.brand-story-text .cute-button-outline {
  color: white;
  border-color: white;
}

.brand-story-text .cute-button-outline:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
  color: white;
}

.brand-story-image {
  flex: 1;
  max-width: 500px;
}

.brand-story-image img {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(255, 105, 180, 0.2);
  transition: transform 0.3s;
}

.brand-story-image img:hover {
  transform: scale(1.02);
}

/* 顾客评价 */
.testimonial-card {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.15);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 182, 193, 0.3);
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 105, 180, 0.4);
}

.testimonial-rating {
  margin-bottom: 16px;
}

.testimonial-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #654972;
  font-style: italic;
  margin-bottom: 24px;
  flex-grow: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #654972;
}

.author-title {
  font-size: 0.9rem;
  color: #b39eb5;
}

/* 订阅通讯 */
.newsletter-section {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  padding: 48px 0;
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
}

.newsletter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.newsletter-text {
  flex: 1;
  color: white;
}

.newsletter-text .section-title {
  color: white;
}

.newsletter-text .section-title::after {
  background-color: white;
}

.newsletter-text p {
  color: rgba(255, 255, 255, 0.9);
}

.newsletter-form {
  flex: 1;
  display: flex;
  gap: 16px;
}

.newsletter-input {
  flex-grow: 1;
}

.newsletter-input :deep(.el-input__wrapper) {
  border-radius: 50px !important;
  padding: 0 15px !important;
  background-color: white !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.newsletter-input :deep(.el-input__wrapper.is-focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 10px rgba(255, 182, 193, 0.4) !important;
  background-color: white !important;
}

.newsletter-input :deep(.el-input__inner) {
  color: #654972;
  height: 40px;
}

.newsletter-input :deep(.el-input__prefix-inner) {
  color: #ff69b4;
  margin-right: 8px;
  font-size: 18px;
}

/* 自定义按钮样式 */
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

/* 响应式调整 */
@media (max-width: 992px) {
  section {
    padding: 50px 30px;
    width: 95%;
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-description {
    font-size: 1rem;
  }
  
  .brand-story-content {
    flex-direction: column;
    gap: 32px;
  }
  
  .brand-story-image {
    max-width: 100%;
  }
  
  .hero-banner :deep(.el-carousel__container) {
    height: 450px;
  }
  
  .banner-item {
    background-position: center 30%;
  }
}

@media (max-width: 768px) {
  section {
    padding: 40px 25px;
  }
  
  .banner-content {
    padding: 0 24px;
    max-width: 90%;
  }
  
  .banner-title {
    font-size: 1.8rem;
  }
  
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-text .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .newsletter-form {
    width: 100%;
  }
  
  .hero-banner :deep(.el-carousel__container) {
    height: 350px;
  }
  
  .banner-item {
    background-position: center 25%;
  }
  
  .doll {
    opacity: 0.1;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 576px) {
  section {
    padding: 30px 20px;
    width: 94%;
  }
  
  .banner-title {
    font-size: 1.5rem;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .hero-banner :deep(.el-carousel__container) {
    height: 300px;
  }
  
  .banner-item {
    background-position: center 20%;
  }
}

.testimonial-section {
  background: linear-gradient(45deg, rgba(255, 232, 240, 0.7) 0%, rgba(245, 233, 255, 0.7) 100%);
  border-radius: 24px;
  padding: 40px 20px;
}

.testimonial-section :deep(.el-carousel__item) {
  border-radius: 20px;
}

.testimonial-section :deep(.el-carousel__indicators) {
  margin-top: 20px;
}

.testimonial-section :deep(.el-carousel__indicator.is-active button) {
  background-color: #ff69b4;
}

.testimonial-section :deep(.el-carousel__button) {
  background-color: rgba(255, 105, 180, 0.3);
  border: none;
}

.testimonial-section :deep(.el-carousel__arrow) {
  background-color: rgba(255, 105, 180, 0.7);
  border-radius: 50%;
  border: 2px solid white;
}

/* 加载和错误状态样式 */
.loading-container {
  padding: 20px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.error-container {
  margin-bottom: 20px;
}

.error-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.no-products {
  text-align: center;
  padding: 40px;
  color: #b39eb5;
  font-size: 1.1rem;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px dashed #ffb6c1;
}
</style>