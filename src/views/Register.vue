<template>
  <div class="register-page">
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
    <div class="register-container">
      <div class="form-header">
        <div class="logo-container">
          <div class="logo-animation"></div>
        </div>
        <h1 class="form-title">加入萌趣玩偶</h1>
        <p class="form-subtitle">创建您的专属账号，探索可爱世界</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username" class="form-item">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email" class="form-item">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入电子邮箱"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password" class="form-item">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword" class="form-item">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="agreement" class="agreement-item">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意<a href="#" class="terms-link">服务条款</a>和<a href="#" class="terms-link">隐私政策</a>
          </el-checkbox>
        </el-form-item>
        
        <el-button 
          type="primary" 
          class="register-button" 
          :loading="loading"
          @click="handleRegister"
        >
          加入萌趣玩偶
        </el-button>
      </el-form>
      
      <div class="form-footer">
        <p>已有账号？<router-link to="/login" class="login-link">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';
import { User, Message, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const registerFormRef = ref(null);
const loading = ref(false);

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
});

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (registerForm.confirmPassword !== '' && registerFormRef.value) {
      // 使用nextTick确保DOM更新后再验证
      nextTick(() => {
        registerFormRef.value?.validateField('confirmPassword');
      });
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意服务条款和隐私政策'));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的电子邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  try {
    await registerFormRef.value.validate();
    
    loading.value = true;
    
    // 模拟API注册请求
    setTimeout(() => {
      // 注册成功，使用email和password登录
      const result = userStore.login(registerForm.email, registerForm.password);
      
      if (result.success) {
        ElMessage.success('注册成功');
        // 跳转到首页
        router.push('/');
      } else {
        ElMessage.error('注册失败，请重试');
      }
      
      loading.value = false;
    }, 1000);
    
  } catch (error) {
    console.error('表单验证失败', error);
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: url('/images/register.png');
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

.register-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px 28px;
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
  width: 60px;
  height: 60px;
  background-color: #ffb6c1;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-animation {
  width: 38px;
  height: 38px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M21,9H15V5c0-1.66-1.34-3-3-3S9,3.34,9,5v4H3c-1.1,0-2,0.9-2,2v9c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2v-9 C23,9.9,22.1,9,21,9z M12,4c0.55,0,1,0.45,1,1v4h-2V5C11,4.45,11.45,4,12,4z M12,17.5L12,17.5c-1.38,0-2.5-1.12-2.5-2.5 c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5C14.5,16.38,13.38,17.5,12,17.5z'/%3E%3C/svg%3E");
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
  margin-bottom: 16px;
}

.form-title {
  font-size: 1.6rem;
  color: #ff69b4;
  margin-bottom: 4px;
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
  font-size: 0.9rem;
  animation: subtitle-appear 1s ease-out;
  margin-bottom: 4px;
}

@keyframes subtitle-appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.register-form {
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
  margin-bottom: 14px;
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
  height: 40px;
}

.form-item :deep(.el-input__prefix-inner) {
  color: #b39eb5;
  margin-right: 8px;
  font-size: 18px;
}

.agreement-item {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff69b4 !important;
  border-color: #ff69b4 !important;
}

:deep(.el-checkbox__label) {
  color: #b39eb5;
}

.terms-link {
  color: #ff69b4;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.terms-link:hover {
  color: #ff1493;
}

.terms-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: #ff69b4;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s;
}

.terms-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.register-button {
  width: 100%;
  margin-bottom: 16px;
  height: 46px;
  font-size: 1rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
}

.register-button:active {
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

.login-link {
  color: #ff69b4;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  padding-bottom: 2px;
  border-bottom: 1px dashed transparent;
}

.login-link:hover {
  color: #ff1493;
  border-bottom-color: #ff1493;
}

@media (max-width: 576px) {
  .register-container {
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
  .register-container {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-item :deep(.el-input__inner) {
    height: 40px;
  }
  
  .register-button {
    height: 46px;
  }
}
</style>