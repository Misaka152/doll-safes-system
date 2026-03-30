<template>
  <header class="site-header">
    <div class="container header-container">
      <!-- Logo区域 -->
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">萌趣玩偶</span>
        </router-link>
      </div>
      
      <!-- 导航菜单 - 桌面版 -->
      <nav class="main-nav desktop-nav">
        <ul class="nav-list">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/products">全部商品</router-link></li>
          <li class="dropdown">
            <span class="dropdown-trigger">分类</span>
            <div class="dropdown-content">
              <router-link 
                v-for="category in categories" 
                :key="category" 
                :to="`/products?category=${category}`"
              >
                {{ category }}
              </router-link>
            </div>
          </li>
        </ul>
      </nav>
      
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-wrap">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button
                v-if="searchQuery.trim()"
                circle
                size="small"
                type="primary"
                @click="handleSearch"
                class="search-button"
              >
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 用户操作区 -->
      <div class="user-actions">
        <router-link to="/cart" class="cart-button">
          <div class="cart-content">
            <el-icon class="cart-icon"><shopping-cart /></el-icon>
            <span class="cart-text">购物车</span>
          </div>
          <el-badge :value="cartItemCount" :hidden="!isLoggedIn || cartItemCount === 0" class="cart-badge"></el-badge>
        </router-link>
        
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click">
            <div class="user-dropdown-link">
              <el-avatar :size="32" class="user-avatar" :src="avatarUrl" @error="handleAvatarError"></el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/profile" class="dropdown-link">个人中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click="handleLogout" class="dropdown-link">退出登录</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            @change="handleFileChange"
          />
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">
            <el-button size="small">登录</el-button>
          </router-link>
          <router-link to="/register" class="register-btn">
            <el-button type="primary" size="small">注册</el-button>
          </router-link>
        </template>
      </div>
      
      <!-- 移动端菜单按钮 -->
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <el-icon v-if="!mobileMenuOpen"><menu /></el-icon>
        <el-icon v-else><close /></el-icon>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ 'is-open': mobileMenuOpen }">
      <nav class="mobile-nav">
        <ul class="mobile-nav-list">
          <li>
            <router-link to="/" @click="closeMobileMenu">首页</router-link>
          </li>
          <li>
            <router-link to="/products" @click="closeMobileMenu">全部商品</router-link>
          </li>
          <li>
            <router-link to="/cart" class="mobile-cart-link" @click="closeMobileMenu">
              购物车
              <el-badge v-if="isLoggedIn && cartItemCount > 0" :value="cartItemCount" class="mobile-cart-badge"></el-badge>
            </router-link>
          </li>
          <li>
            <div class="mobile-dropdown">
              <div class="mobile-dropdown-header" @click="toggleCategoryMenu">
                分类
                <el-icon><arrow-down /></el-icon>
              </div>
              <ul class="mobile-dropdown-content" v-show="categoryMenuOpen">
                <li v-for="category in categories" :key="category">
                  <router-link 
                    :to="`/products?category=${category}`" 
                    @click="closeMobileMenu"
                  >
                    {{ category }}
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login" @click="closeMobileMenu">登录</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register" @click="closeMobileMenu">注册</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/profile" @click="closeMobileMenu">个人中心</router-link>
          </li>
          <li v-if="isLoggedIn">
            <a @click="handleLogoutMobile">退出登录</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { useCartStore } from '../../stores/cart';
import { useProductStore } from '../../stores/products';
import { Search, ShoppingCart, Menu, Close, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const fileInput = ref(null);

// 头像相关
const avatarUrl = computed(() => {
  // 优先使用本地存储的头像
  const savedAvatar = localStorage.getItem('userAvatar');
  if (savedAvatar) {
    return savedAvatar;
  }
  // 没有头像时使用默认头像
  return '/images/avater.png';
});

// 在组件挂载时加载用户头像
onMounted(() => {
  // 组件挂载时可能需要的其他初始化代码
});

// 处理头像加载错误
const handleAvatarError = () => {
  // 如果头像加载失败，回退到用户名首字母
  avatarUrl.value = '';
};

// 上传头像
const uploadAvatar = () => {
  // 保留此函数，但不在菜单中触发
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件');
      return;
    }

    // 验证文件大小，限制为2MB
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过2MB');
      return;
    }

    // 读取文件为DataURL
    const reader = new FileReader();
    reader.onload = (e) => {
      // 更新头像URL到本地存储和用户状态
      localStorage.setItem('userAvatar', e.target.result);
      
      // 如果用户已登录，同时更新用户状态
      if (isLoggedIn.value) {
        userStore.updateUser({ avatar: e.target.result });
      }
      
      ElMessage.success('头像更新成功');
    };
    reader.onerror = () => {
      ElMessage.error('读取文件失败');
    };
    reader.readAsDataURL(file);
  }
};

// 搜索功能
const searchQuery = ref('');
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('执行搜索:', searchQuery.value.trim());
    // 跳转到商品页面并带上搜索参数
    router.push({ 
      path: '/products', 
      query: { search: searchQuery.value.trim() } 
    });
    // 保持搜索文本，不清空，这样用户可以看到自己搜索了什么
    // searchQuery.value = '';
    closeMobileMenu();
  }
};

// 移动端菜单状态
const mobileMenuOpen = ref(false);
const categoryMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  // 关闭分类子菜单
  if (!mobileMenuOpen.value) {
    categoryMenuOpen.value = false;
  }
};

const toggleCategoryMenu = () => {
  categoryMenuOpen.value = !categoryMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  categoryMenuOpen.value = false;
};

// 用户相关
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userInitials = computed(() => {
  const name = userStore.userName || '用户';
  return name.charAt(0).toUpperCase();
});

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const handleLogoutMobile = () => {
  userStore.logout();
  closeMobileMenu();
  router.push('/');
};

// 购物车
const cartItemCount = computed(() => cartStore.totalQuantity || 0);

// 商品分类
const categories = computed(() => productStore.categories || []);
</script>

<style scoped>
.site-header {
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: relative;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff69b4;
  text-decoration: none;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-text {
  margin-left: 8px;
}

/* 导航菜单 */
.main-nav {
  margin: 0 16px;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list li {
  margin: 0 16px;
}

.nav-list a {
  color: #654972;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: #ff69b4;
}

/* 搜索框 */
.search-container {
  flex-grow: 1;
  max-width: 400px;
  margin: 0 16px;
  position: relative;
}

.search-wrap {
  width: 100%;
  position: relative;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 50px !important;
  padding: 0 15px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 10px rgba(255, 182, 193, 0.4) !important;
  background-color: white !important;
}

.search-input :deep(.el-input__inner) {
  color: #654972;
  height: 40px;
}

.search-input :deep(.el-input__prefix-inner) {
  color: #ff69b4;
  margin-right: 8px;
  font-size: 18px;
}

.search-button {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
}

/* 用户操作区 */
.user-actions {
  display: flex;
  align-items: center;
}

.cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  color: white;
  padding: 8px 12px;
  border-radius: 50px;
  text-decoration: none;
  margin-right: 16px;
  transition: all 0.3s ease;
  min-width: 100px;
  position: relative;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.cart-button:hover {
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
}

.cart-icon {
  font-size: 1.25rem;
  margin-right: 6px;
}

.cart-text {
  font-weight: 500;
  font-size: 0.9rem;
}

.cart-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
}

.cart-badge :deep(.el-badge__content) {
  background-color: white;
  color: var(--primary-color);
  border: none;
  font-weight: bold;
}

.user-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-avatar {
  background-color: #ffb6c1;
  color: white;
  box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
  transition: transform 0.3s;
}

.user-dropdown-link:hover .user-avatar {
  transform: scale(1.1);
}

.login-btn,
.register-btn {
  margin-left: 8px;
}

.login-btn :deep(.el-button),
.register-btn :deep(.el-button) {
  height: 40px;
  border-radius: 50px;
  padding: 0 20px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.2);
  transition: all 0.3s ease;
}

.login-btn :deep(.el-button) {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ffb6c1;
  color: #ff69b4;
}

.login-btn :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 105, 180, 0.3);
}

.register-btn :deep(.el-button) {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  color: white;
}

.register-btn :deep(.el-button:hover) {
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 105, 180, 0.3);
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--neutral-700);
  font-weight: 500;
}

.dropdown-trigger:hover {
  color: var(--primary-color);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(255, 255, 255, 0.95);
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(255, 105, 180, 0.2);
  border-radius: 12px;
  padding: 8px 0;
  z-index: 101;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.dropdown:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content a {
  display: block;
  padding: 8px 16px;
  color: var(--neutral-700);
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: var(--neutral-100);
  color: var(--primary-color);
}

.dropdown-link {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
}

/* 移动端菜单 */
.mobile-menu-toggle {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  background: linear-gradient(135deg, #ffe8f0 0%, #f5e9ff 100%);
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.is-open {
  transform: translateX(0);
}

.mobile-nav-list {
  list-style: none;
  padding: 16px;
  margin: 0;
}

.mobile-nav-list li {
  margin-bottom: 16px;
}

.mobile-nav-list a {
  display: block;
  padding: 12px 16px;
  color: #654972;
  text-decoration: none;
  font-size: 1.1rem;
  border-radius: 50px;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  backdrop-filter: blur(5px);
}

.mobile-nav-list a:hover,
.mobile-nav-list a.router-link-active {
  background-color: rgba(255, 255, 255, 0.9);
  color: #ff69b4;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.2);
}

.mobile-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.6);
  color: #654972;
  margin-bottom: 8px;
  backdrop-filter: blur(5px);
}

.mobile-dropdown-header:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #ff69b4;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.2);
}

.mobile-dropdown-content {
  list-style: none;
  padding-left: 16px;
  margin-top: 8px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .search-container {
    max-width: 300px;
  }
  
  .cart-text {
    display: none;
  }
  
  .cart-button {
    padding: 8px;
    min-width: unset;
  }
  
  .cart-icon {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .search-container {
    max-width: none;
    flex-grow: 1;
    margin-right: 16px;
  }
  
  .login-btn,
  .register-btn {
    display: none;
  }
  
  .header-container {
    padding: 12px 16px;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .cart-button {
    margin-right: 8px;
  }
}

@media (max-width: 576px) {
  .header-container {
    padding: 12px;
  }
  
  .logo-text {
    display: none;
  }
}

.mobile-cart-link {
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(45deg, rgba(255, 105, 180, 0.2), rgba(255, 182, 193, 0.2)) !important;
}

.mobile-cart-link:hover {
  background: linear-gradient(45deg, rgba(255, 105, 180, 0.3), rgba(255, 182, 193, 0.3)) !important;
}

.mobile-cart-badge :deep(.el-badge__content) {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1) !important;
  color: white !important;
  border: none !important;
}
</style>