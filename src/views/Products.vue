<template>
  <div class="products-page">
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
      <header class="page-header">
        <div class="logo-container">
          <div class="logo-animation"></div>
        </div>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-description">{{ pageDescription }}</p>
      </header>
      
      <!-- 筛选器与排序 -->
      <div class="filter-section">
        <div class="filters">
          <el-select v-model="categoryFilter" placeholder="选择分类" clearable @change="applyFilters" class="cute-select">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
          
          <el-select v-model="priceFilter" placeholder="价格范围" clearable @change="applyFilters" class="cute-select">
            <el-option label="低于¥50" value="lt50" />
            <el-option label="¥50 - ¥100" value="50-100" />
            <el-option label="¥100 - ¥150" value="100-150" />
            <el-option label="¥150以上" value="gt150" />
          </el-select>
          
          <el-checkbox v-model="newFilter" @change="applyFilters" class="cute-checkbox">只看新品</el-checkbox>
          <el-checkbox v-model="inStockFilter" @change="applyFilters" class="cute-checkbox">有库存</el-checkbox>
          
          <el-button 
            type="primary" 
            plain 
            @click="resetFilters"
            class="reset-button"
            icon="Refresh"
          >
            重置
          </el-button>
        </div>
        
        <div class="sorting">
          <span class="sort-label">排序：</span>
          <el-select v-model="sortOption" @change="applyFilters" class="cute-select">
            <el-option label="默认排序" value="default" />
            <el-option label="价格从低到高" value="priceAsc" />
            <el-option label="价格从高到低" value="priceDesc" />
            <el-option label="评分最高" value="rating" />
          </el-select>
        </div>
      </div>
      
      <!-- 搜索结果统计 -->
      <div v-if="!isLoading && !loadError" class="results-info">
        找到 <strong>{{ filteredProducts.length }}</strong> 个产品
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <!-- 错误提示 -->
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
      
      <!-- 产品列表 -->
      <div v-else-if="filteredProducts.length > 0" class="product-grid">
        <div v-for="product in paginatedProducts" :key="product.id" class="product-item">
          <ProductCard :product="product" />
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="未找到符合条件的商品" />
        <el-button type="primary" @click="resetFilters" class="cute-button">重置筛选条件</el-button>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container" v-if="filteredProducts.length > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="filteredProducts.length"
          :page-size="pageSize"
          :page-sizes="[8, 12, 24, 36]"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          class="cute-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/product/ProductCard.vue';
import { useProductStore } from '../stores/products';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

// 分页参数
const currentPage = ref(1);
const pageSize = ref(12);

// 筛选参数
const categoryFilter = ref('');
const priceFilter = ref('');
const newFilter = ref(false);
const inStockFilter = ref(false);
const sortOption = ref('default');
const searchQuery = ref('');

// 加载状态
const isLoading = computed(() => productStore.loading);
const loadError = computed(() => productStore.error);

// 获取路由查询参数
const updateFiltersFromQuery = () => {
  const { category, search, new: isNew, page, size } = route.query;
  
  if (category) {
    categoryFilter.value = category;
  }
  
  if (search) {
    searchQuery.value = search;
  }
  
  if (isNew === 'true') {
    newFilter.value = true;
  }

  if (page) {
    currentPage.value = parseInt(page, 10);
  } else {
    currentPage.value = 1;
  }

  if (size) {
    pageSize.value = parseInt(size, 10);
  }
};

// 初始化
onMounted(async () => {
  updateFiltersFromQuery();
  
  // 获取产品数据
  await productStore.fetchProducts();
});

// 监听路由变化
watch(
  () => route.query,
  () => {
    updateFiltersFromQuery();
  }
);

// 计算标题和描述
const pageTitle = computed(() => {
  if (searchQuery.value) {
    return `搜索结果: "${searchQuery.value}"`;
  }
  
  if (categoryFilter.value) {
    return categoryFilter.value;
  }
  
  if (newFilter.value) {
    return '新品上市';
  }
  
  return '全部商品';
});

const pageDescription = computed(() => {
  if (searchQuery.value) {
    return `为您找到与"${searchQuery.value}"相关的产品`;
  }
  
  if (categoryFilter.value) {
    return `浏览我们精选的${categoryFilter.value}系列`;
  }
  
  if (newFilter.value) {
    return '最新上市的玩偶产品，等待您的发现';
  }
  
  return '浏览我们所有的玩偶产品，找到您的心仪之选';
});

// 筛选和排序产品
const filteredProducts = computed(() => {
  let result = [...productStore.products];
  
  // 应用搜索
  if (searchQuery.value) {
    console.log('正在搜索产品:', searchQuery.value);
    result = productStore.searchProducts(searchQuery.value);
    console.log('搜索结果数量:', result.length);
  }
  
  // 应用类别筛选
  if (categoryFilter.value) {
    result = result.filter(product => product.category === categoryFilter.value);
  }
  
  // 应用价格筛选
  if (priceFilter.value) {
    switch (priceFilter.value) {
      case 'lt50':
        result = result.filter(product => product.price < 50);
        break;
      case '50-100':
        result = result.filter(product => product.price >= 50 && product.price <= 100);
        break;
      case '100-150':
        result = result.filter(product => product.price > 100 && product.price <= 150);
        break;
      case 'gt150':
        result = result.filter(product => product.price > 150);
        break;
    }
  }
  
  // 应用新品筛选
  if (newFilter.value) {
    result = result.filter(product => product.isNew);
  }
  
  // 应用库存筛选
  if (inStockFilter.value) {
    result = result.filter(product => product.stock > 0);
  }
  
  // 应用排序
  switch (sortOption.value) {
    case 'priceAsc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    // 默认排序保持原样
  }
  
  return result;
});

// 分页产品
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
});

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateQueryParams();
};

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  // 重置到第一页，避免超出范围
  currentPage.value = 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateQueryParams();
};

// 更新URL查询参数
const updateQueryParams = () => {
  const query = { ...route.query };

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  } else {
    delete query.page;
  }

  if (pageSize.value !== 12) { // 12是默认值
    query.size = pageSize.value.toString();
  } else {
    delete query.size;
  }

  router.push({ query });
};

// 应用筛选器
const applyFilters = () => {
  currentPage.value = 1;
  
  // 更新URL查询参数
  const query = {};
  
  if (categoryFilter.value) {
    query.category = categoryFilter.value;
  }
  
  if (searchQuery.value) {
    query.search = searchQuery.value;
  }
  
  if (newFilter.value) {
    query.new = 'true';
  }

  if (pageSize.value !== 12) {
    query.size = pageSize.value.toString();
  }
  
  router.push({ query });
};

// 重置筛选器
const resetFilters = () => {
  categoryFilter.value = '';
  priceFilter.value = '';
  newFilter.value = false;
  inStockFilter.value = false;
  sortOption.value = 'default';
  searchQuery.value = '';
  
  applyFilters();
};

// 获取所有分类
const categories = computed(() => productStore.categories);
</script>

<style scoped>
.products-page {
  min-height: calc(100vh - 200px);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
  padding: 32px 16px;
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
  opacity: 0.2;
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
  max-width: 1200px;
  margin: 0 auto;
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

.logo-container {
  width: 80px;
  height: 80px;
  background-color: #ffb6c1;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-animation {
  width: 50px;
  height: 50px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M18.06 23h1.66c.84 0 1.53-.65 1.63-1.47L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 22v-3h2.04c.83 0 1.5.67 1.5 1.5 0 .83-.67 1.5-1.5 1.5H1zm1.03-7.07V18h6.94l-2.66-2.67c-1.23-1.23-1.97-2.92-1.97-4.8V7.04c0-1.1.9-2 2-2h.59c.89 0 1.64.59 1.9 1.4l.97 3.21C10.9 11.93 11.99 14 15.03 14v-4C12 10 11 9 10.97 7.57l-1-3.14C9.85 3 8.59 2 7.23 2c-2.76 0-5 2.24-5 5v2.12c0 .73.14 1.44.4 2.11.21.55.26 1.27.4 3.7z'/%3E%3C/svg%3E");
  background-size: contain;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0.95);
  }
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  animation: title-appear 0.8s ease-out;
}

.page-title {
  font-size: 2rem;
  color: #ff69b4;
  margin-bottom: 8px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(255, 105, 180, 0.2);
}

@keyframes title-appear {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-description {
  color: #b8a9c9;
  font-size: 1rem;
  margin: 0 auto;
  max-width: 600px;
  animation: subtitle-appear 1s ease-out;
}

@keyframes subtitle-appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.filter-section {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.15);
  flex-wrap: wrap;
  gap: 16px;
  animation: form-appear 1.2s ease-out;
  border: 1px solid rgba(255, 182, 193, 0.3);
  backdrop-filter: blur(5px);
}

@keyframes form-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.sorting {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  color: #b39eb5;
  white-space: nowrap;
}

.results-info {
  margin-bottom: 24px;
  color: #b39eb5;
  text-align: center;
  font-size: 1.1rem;
  animation: subtitle-appear 1.3s ease-out;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  animation: grid-appear 1.4s ease-out;
}

@keyframes grid-appear {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.product-item {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transform: translateY(0);
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.15);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.cute-button {
  margin-top: 20px;
  height: 46px;
  font-size: 1rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
  padding: 0 30px;
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

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 20px;
  animation: footer-appear 1.5s ease-out;
}

@keyframes footer-appear {
  0% {
    opacity: 0;
  }
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 修改筛选器样式 */
.cute-select :deep(.el-input__wrapper) {
  border-radius: 50px !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  background-color: white !important;
  padding: 0 15px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.cute-select :deep(.el-input__inner) {
  color: #654972 !important;
  height: 40px !important;
  font-size: 0.95rem !important;
}

.cute-select :deep(.el-input__suffix) {
  right: 10px !important;
}

.cute-select :deep(.el-select-dropdown.el-popper) {
  border-radius: 16px !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: 0 6px 16px rgba(255, 105, 180, 0.15) !important;
}

.cute-select :deep(.el-select-dropdown__item) {
  color: #654972 !important;
}

.cute-select :deep(.el-select-dropdown__item.selected) {
  color: #ff69b4 !important;
  font-weight: bold !important;
  background-color: rgba(255, 182, 193, 0.2) !important;
}

.cute-select :deep(.el-select-dropdown__item:hover) {
  background-color: rgba(255, 182, 193, 0.1) !important;
}

/* Checkbox样式 */
.cute-checkbox {
  margin-right: 15px !important;
}

.cute-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff69b4 !important;
  border-color: #ff69b4 !important;
}

.cute-checkbox :deep(.el-checkbox__input .el-checkbox__inner) {
  border-radius: 50% !important;
  border: 2px solid #ffb6c1 !important;
  background-color: white !important;
  height: 18px !important;
  width: 18px !important;
  transition: all 0.3s ease !important;
}

.cute-checkbox :deep(.el-checkbox__input .el-checkbox__inner:hover) {
  border-color: #ff69b4 !important;
}

.cute-checkbox :deep(.el-checkbox__inner::after) {
  height: 8px !important;
  left: 5px !important;
  top: 2px !important;
}

.cute-checkbox :deep(.el-checkbox__label) {
  color: #654972 !important;
  font-size: 0.95rem !important;
  padding-left: 8px !important;
}

/* 改进分页样式 */
.cute-pagination :deep(.el-pagination) {
  background-color: rgba(255, 255, 255, 0.9) !important;
  padding: 12px 20px !important;
  border-radius: 50px !important;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.15) !important;
  border: 1px solid rgba(255, 182, 193, 0.3) !important;
  backdrop-filter: blur(5px) !important;
  --el-pagination-button-color: #b39eb5;
  --el-pagination-button-bg-color: transparent;
  --el-pagination-button-size: 36px;
  --el-pagination-button-margin: 0 5px;
  --el-pagination-button-border-radius: 50%;
  font-size: 1rem;
}

.cute-pagination :deep(.el-pagination button) {
  background-color: transparent !important;
  color: #b39eb5 !important;
  border: none !important;
  margin: 0 4px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.cute-pagination :deep(.el-pagination .btn-next),
.cute-pagination :deep(.el-pagination .btn-prev) {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1) !important;
  color: white !important;
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3) !important;
}

.cute-pagination :deep(.el-pagination .btn-next:hover),
.cute-pagination :deep(.el-pagination .btn-prev:hover) {
  transform: scale(1.05) !important;
}

.cute-pagination :deep(.el-pagination button:disabled) {
  background-color: rgba(255, 255, 255, 0.5) !important;
  color: #d3d3d3 !important;
}

.cute-pagination :deep(.el-pagination .el-pagination__jump) {
  color: #b39eb5 !important;
  margin-left: 15px !important;
}

.cute-pagination :deep(.el-pagination .el-pagination__editor.el-input) {
  width: 50px !important;
  margin: 0 5px !important;
}

.cute-pagination :deep(.el-pagination .el-pagination__editor.el-input .el-input__wrapper) {
  border-radius: 50px !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
}

.cute-pagination :deep(.el-pagination .el-pagination__editor.el-input .el-input__inner) {
  color: #654972 !important;
  text-align: center !important;
}

.cute-pagination :deep(.el-pagination .el-pagination__total) {
  color: #b39eb5;
}

.cute-pagination :deep(.el-pagination .el-select .el-input) {
  margin: 0 5px !important;
  width: 110px !important;
}

.cute-pagination :deep(.el-pagination .el-select .el-input__wrapper) {
  border-radius: 50px !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
}

.cute-pagination :deep(.el-pagination .el-select .el-input__inner) {
  color: #654972 !important;
}

.cute-pagination :deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent !important;
  color: #b39eb5 !important;
  font-size: 14px !important;
  min-width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  border-radius: 50% !important;
  margin: 0 4px !important;
  transition: all 0.3s ease !important;
}

.cute-pagination :deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  color: #ff69b4 !important;
  transform: scale(1.1) !important;
}

.cute-pagination :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1) !important;
  color: white !important;
  font-weight: bold !important;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3) !important;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }
  
  .filters, .sorting {
    width: 100%;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .doll {
    opacity: 0.1;
  }
  
  .cute-pagination :deep(.el-pagination) {
    padding: 8px 12px !important;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 380px) {
  .page-title {
    font-size: 1.7rem;
  }
  
  .filters {
    gap: 8px;
  }
  
  .results-info {
    font-size: 0.9rem;
  }
  
  .cute-pagination :deep(.el-pagination) {
    font-size: 0.9rem;
  }
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
</style>