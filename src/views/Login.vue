<template>
  <div class="login-page">
    <div class="animated-background">
      <div class="floating-dolls">
        <div class="doll doll-1"></div>
        <div class="doll doll-2"></div>
        <div class="doll doll-3"></div>
        <div class="doll doll-4"></div>
        <div class="doll doll-5"></div>
      </div>
    </div>
    <div class="login-container">
      <div class="form-header">
        <div class="logo-container">
          <div class="logo-animation"></div>
        </div>
        <h1 class="form-title">欢迎回来</h1>
        <p class="form-subtitle">登录您的萌趣玩偶账号</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        @keyup.enter="handleLogin"
        class="login-form"
      >
        <el-form-item label="电子邮箱" prop="email" class="form-item">
          <el-input 
            v-model="loginForm.email" 
            placeholder="请输入电子邮箱"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password" class="form-item">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>
        
        <el-button 
          type="primary" 
          class="login-button" 
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>
      
      <div class="form-footer">
        <p>还没有账号？<router-link to="/register" class="register-link">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';
import { Message, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loginFormRef = ref(null);
const loading = ref(false);

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});

// 表单验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的电子邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  try {
    await loginFormRef.value.validate();
    
    loading.value = true;
    
    // 无需调用后端API，直接使用本地登录
    console.log('正在登录...');
    
    // 使用用户输入的任意邮箱和密码登录
    const result = userStore.login(loginForm.email, loginForm.password);
    
    if (result.success) {
      ElMessage.success('登录成功');
        
      // 重定向到之前尝试访问的页面或首页
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    } else {
      ElMessage.error('登录失败，请重试');
    }
    
    loading.value = false;
  } catch (error) {
    console.error('表单验证失败', error);
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: url('/images/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 32px 16px;
}

/* 隐藏不需要的元素 */
.animated-background,
.floating-dolls {
  display: none;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  position: relative;
  z-index: 1;
  transform: translateY(0);
  animation: container-appear 0.6s ease-out;
  border: 1px solid rgba(255, 182, 193, 0.3);
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5ZM12 19.2C14.5 19.2 16.64 17.94 18 16.12C17.47 14.09 15.94 12.8 14 12.8H10C8.06 12.8 6.53 14.09 6 16.12C7.36 17.94 9.5 19.2 12 19.2Z'/%3E%3C/svg%3E");
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

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 2rem;
  color: #ff69b4;
  margin-bottom: 8px;
  font-weight: 700;
  animation: title-appear 0.8s ease-out;
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

.form-subtitle {
  color: #b8a9c9;
  font-size: 1rem;
  animation: subtitle-appear 1s ease-out;
  margin-bottom: 8px;
}

@keyframes subtitle-appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.login-form {
  animation: form-appear 1.2s ease-out;
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

/* 表单项样式 */
.form-item {
  margin-bottom: 20px;
}

.form-item :deep(.el-form-item__label) {
  color: #b39eb5;
  font-size: 0.95rem;
  font-weight: 500;
  padding-bottom: 4px;
}

.form-item :deep(.el-input__wrapper) {
  border-radius: 50px !important;
  padding: 0 15px !important;
  background-color: white !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.form-item :deep(.el-input__wrapper.is-focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 10px rgba(255, 182, 193, 0.4) !important;
}

.form-item :deep(.el-input__inner) {
  color: #654972;
  height: 44px;
}

.form-item :deep(.el-input__prefix-inner) {
  color: #b39eb5;
  margin-right: 8px;
  font-size: 18px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff69b4 !important;
  border-color: #ff69b4 !important;
}

:deep(.el-checkbox__label) {
  color: #b39eb5;
}

.forgot-password {
  color: #ff69b4;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-password:hover {
  color: #ff1493;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  margin-bottom: 24px;
  height: 50px;
  font-size: 1.1rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
}

.login-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.4);
}

.form-footer {
  text-align: center;
  font-size: 0.95rem;
  color: #b39eb5;
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

.register-link {
  color: #ff69b4;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  padding-bottom: 2px;
  border-bottom: 1px dashed transparent;
}

.register-link:hover {
  color: #ff1493;
  border-bottom-color: #ff1493;
}

@media (max-width: 576px) {
  .login-container {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .logo-container {
    width: 70px;
    height: 70px;
  }
  
  .form-title {
    font-size: 1.7rem;
  }
  
  .doll {
    opacity: 0.1;
  }
}

@media (max-width: 380px) {
  .login-container {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-item :deep(.el-input__inner) {
    height: 40px;
  }
  
  .login-button {
    height: 46px;
  }
}
</style>