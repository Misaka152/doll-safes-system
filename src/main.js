import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import IconsLegacy from './components/IconsLegacy.vue'

const pinia = createPinia()
const app = createApp(App)

// 注册所有Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册旧版图标兼容组件
app.component('el-icon-search', IconsLegacy)
app.component('el-icon-shopping-cart', IconsLegacy)
app.component('el-icon-menu', IconsLegacy)
app.component('el-icon-close', IconsLegacy)
app.component('el-icon-arrow-down', IconsLegacy)
app.component('el-icon-arrow-right', IconsLegacy)
app.component('el-icon-user', IconsLegacy)
app.component('el-icon-message', IconsLegacy)
app.component('el-icon-lock', IconsLegacy)
app.component('el-icon-star', IconsLegacy)
app.component('el-icon-star-filled', IconsLegacy)
app.component('el-icon-refresh', IconsLegacy)
app.component('el-icon-location', IconsLegacy)
app.component('el-icon-document', IconsLegacy)
app.component('el-icon-setting', IconsLegacy)

app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.mount('#app')