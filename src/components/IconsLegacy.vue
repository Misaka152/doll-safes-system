<template>
  <component :is="getCurrentIcon" />
</template>

<script>
import { 
  Search, 
  ShoppingCart, 
  Menu,
  Close,
  ArrowDown,
  ArrowRight,
  User,
  Message,
  Lock,
  Star,
  StarFilled,
  Refresh,
  Location,
  Document,
  Setting
} from '@element-plus/icons-vue'
import { h } from 'vue'

export default {
  name: 'IconsLegacy',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    getCurrentIcon() {
      // 将旧式图标名称映射到新的组件
      const iconMap = {
        'el-icon-search': Search,
        'el-icon-shopping-cart': ShoppingCart,
        'el-icon-menu': Menu,
        'el-icon-close': Close,
        'el-icon-arrow-down': ArrowDown,
        'el-icon-arrow-right': ArrowRight,
        'el-icon-user': User,
        'el-icon-message': Message,
        'el-icon-lock': Lock,
        'el-icon-star': Star,
        'el-icon-star-filled': StarFilled,
        'el-icon-refresh': Refresh,
        'el-icon-location': Location,
        'el-icon-document': Document,
        'el-icon-setting': Setting
      }
      
      const icon = iconMap[this.name]
      
      if (icon) {
        return h(icon)
      }
      
      console.warn(`Icon ${this.name} not found in map`)
      return h('i', {class: this.name}) // 回退到使用class
    }
  }
}
</script>