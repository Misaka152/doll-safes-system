<template>
  <div class="app-container">
    <Header v-if="!isAuthPage" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();

// 检查当前是否在登录或注册页面
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 16px 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 8px 0;
  }
}
</style>