<template>
  <div class="profile-page">
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
      <div class="page-header">
        <div class="logo-container">
          <div class="logo-animation"></div>
        </div>
        <h1 class="page-title">个人中心</h1>
      </div>
      
      <div class="profile-content">
        <!-- 侧边栏导航 -->
        <div class="profile-sidebar">
          <div class="user-info">
            <div class="avatar-container" @click="uploadAvatar">
              <el-avatar :size="80" class="user-avatar" :src="avatarUrl" @error="handleAvatarError">
                {{ userInitial }}
              </el-avatar>
              <div class="avatar-hover-text">点击更换</div>
            </div>
            <div class="user-details">
              <h3 class="user-name">{{ userName }}</h3>
            </div>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept="image/*"
              @change="handleFileChange"
            />
          </div>
          
          <div class="sidebar-nav">
            <el-menu
              :default-active="activeTab"
              class="profile-menu"
              @select="handleTabChange"
            >
              <el-menu-item index="profile">
                <el-icon><el-icon-user /></el-icon>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item index="orders">
                <el-icon><el-icon-document /></el-icon>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="addresses">
                <el-icon><el-icon-location /></el-icon>
                <span>收货地址</span>
              </el-menu-item>
              <el-menu-item index="favorites">
                <el-icon><el-icon-star /></el-icon>
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="settings">
                <el-icon><el-icon-setting /></el-icon>
                <span>账号设置</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        
        <!-- 主内容区 -->
        <div class="profile-main">
          <!-- 个人资料 -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <div class="section-header">
              <h2 class="section-title">个人资料</h2>
              <el-button 
                type="primary" 
                plain 
                size="small" 
                @click="editMode = !editMode"
                class="cute-button"
              >
                {{ editMode ? '取消' : '编辑' }}
              </el-button>
            </div>
            
            <el-form 
              :model="profileForm" 
              :disabled="!editMode"
              label-width="100px"
              class="cute-form"
            >
              <el-form-item label="用户名" class="cute-form-item">
                <el-input v-model="profileForm.name" class="cute-input">
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="电子邮箱" class="cute-form-item">
                <el-input v-model="profileForm.email" disabled class="cute-input">
                  <template #prefix>
                    <el-icon><Message /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="手机号码" class="cute-form-item">
                <el-input v-model="profileForm.phone" class="cute-input">
                  <template #prefix>
                    <el-icon><Iphone /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="生日" class="form-item">
                <el-date-picker 
                  v-model="profileForm.birthday" 
                  type="date" 
                  placeholder="选择日期"
                  class="date-picker"
                />
              </el-form-item>
              
              <el-form-item label="性别" class="form-item">
                <el-radio-group v-model="profileForm.gender">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                  <el-radio label="other">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item v-if="editMode">
                <el-button type="primary" @click="saveProfile" class="submit-button">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 我的订单 -->
          <div v-if="activeTab === 'orders'" class="tab-content">
            <div class="section-header">
              <h2 class="section-title">我的订单</h2>
            </div>
            
            <el-tabs v-model="orderStatus" class="order-tabs cute-tabs">
              <el-tab-pane label="全部" name="all"></el-tab-pane>
              <el-tab-pane label="待付款" name="pending"></el-tab-pane>
              <el-tab-pane label="待发货" name="paid"></el-tab-pane>
              <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
              <el-tab-pane label="已完成" name="completed"></el-tab-pane>
            </el-tabs>
            
            <div v-if="filteredOrders.length > 0" class="orders-list">
              <div v-for="(order, index) in filteredOrders" :key="order.id" class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <span class="order-id">订单号: {{ order.id }}</span>
                    <span class="order-date">{{ order.date }}</span>
                  </div>
                  <div class="order-status">
                    <el-tag :type="getStatusType(order.status)" class="cute-tag">
                      {{ getStatusText(order.status) }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="order-items">
                  <div v-for="item in order.items" :key="item.id" class="order-item">
                    <div class="item-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                    <div class="item-info">
                      <div class="item-name">{{ item.name }}</div>
                      <div class="item-meta">
                        <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
                        <span class="item-quantity">x{{ item.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <div class="order-total">
                    共 {{ getTotalItems(order) }} 件商品，
                    总计: <span class="total-price">¥{{ getTotalPrice(order).toFixed(2) }}</span>
                  </div>
                  <div class="order-actions">
                    <el-button size="small" plain class="cute-button" @click="showOrderDetail(order)">查看详情</el-button>
                    <el-button 
                      v-if="order.status === 'pending'" 
                      type="primary" 
                      size="small"
                      class="cute-button"
                      @click="payOrder(index)"
                    >
                      去付款
                    </el-button>
                    <el-button 
                      v-if="order.status === 'shipped'" 
                      type="success" 
                      size="small"
                      class="cute-button success"
                      @click="confirmReceiveOrder(index)"
                    >
                      确认收货
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small"
                      plain
                      class="cute-button danger"
                      @click="deleteOrder(index)"
                    >
                      删除订单
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-list">
              <el-empty description="暂无订单记录" />
            </div>
            
            <!-- 订单详情对话框 -->
            <el-dialog
              title="订单详情"
              v-model="orderDetailVisible"
              width="600px"
              class="cute-dialog order-detail-dialog"
              append-to-body
              center
            >
              <div v-if="currentOrder" class="order-detail">
                <div class="detail-header">
                  <div class="detail-id">订单编号：{{ currentOrder.id }}</div>
                  <div class="detail-date">下单时间：{{ currentOrder.date }}</div>
                  <div class="detail-status">
                    订单状态：
                    <el-tag :type="getStatusType(currentOrder.status)" class="cute-tag">
                      {{ getStatusText(currentOrder.status) }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="detail-divider"></div>
                
                <div class="detail-items">
                  <h4 class="detail-subtitle">商品信息</h4>
                  <div v-for="item in currentOrder.items" :key="item.id" class="detail-item">
                    <div class="detail-item-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                    <div class="detail-item-info">
                      <div class="detail-item-name">{{ item.name }}</div>
                      <div class="detail-item-price">¥{{ item.price.toFixed(2) }}</div>
                      <div class="detail-item-quantity">x{{ item.quantity }}</div>
                    </div>
                    <div class="detail-item-subtotal">
                      小计：¥{{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                </div>
                
                <div class="detail-divider"></div>
                
                <div class="detail-summary">
                  <div class="detail-summary-row">
                    <span>商品数量：</span>
                    <span>{{ getTotalItems(currentOrder) }} 件</span>
                  </div>
                  <div class="detail-summary-row">
                    <span>商品总价：</span>
                    <span>¥{{ getTotalPrice(currentOrder).toFixed(2) }}</span>
                  </div>
                  <div class="detail-summary-row">
                    <span>运费：</span>
                    <span>¥0.00</span>
                  </div>
                  <div class="detail-summary-row detail-total">
                    <span>实付款：</span>
                    <span class="detail-total-price">¥{{ getTotalPrice(currentOrder).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <template #footer>
                <el-button @click="orderDetailVisible = false" class="cute-button outline">关闭</el-button>
              </template>
            </el-dialog>
          </div>
          
          <!-- 收货地址 -->
          <div v-if="activeTab === 'addresses'" class="tab-content">
            <div class="section-header">
              <h2 class="section-title">收货地址</h2>
              <el-button 
                type="primary" 
                plain 
                size="small" 
                @click="addNewAddress"
                class="cute-button"
              >
                添加地址
              </el-button>
            </div>
            
            <div v-if="addresses.length > 0" class="addresses-list">
              <div v-for="(address, index) in addresses" :key="index" class="address-card">
                <div class="address-content">
                  <div class="address-header">
                    <span class="recipient-name">{{ address.name }}</span>
                    <span class="recipient-phone">{{ address.phone }}</span>
                    <el-tag v-if="address.isDefault" size="small" type="success" class="cute-tag">
                      默认地址
                    </el-tag>
                  </div>
                  <div class="address-details">
                    {{ formatAddress(address) }}
                  </div>
                </div>
                <div class="address-actions">
                  <el-button size="small" plain @click="editAddress(index)" class="cute-button">编辑</el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    plain 
                    @click="deleteAddress(index)"
                    class="cute-button danger"
                  >
                    删除
                  </el-button>
                  <el-button 
                    v-if="!address.isDefault" 
                    size="small" 
                    @click="setDefaultAddress(index)"
                    class="cute-button outline"
                  >
                    设为默认
                  </el-button>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-list">
              <el-empty description="暂无收货地址" />
              <el-button type="primary" @click="addNewAddress" class="cute-button">添加地址</el-button>
            </div>
            
            <!-- 地址编辑对话框 -->
            <el-dialog 
              :title="addressDialogTitle" 
              v-model="addressDialogVisible"
              width="500px"
              class="cute-dialog"
            >
              <el-form :model="addressForm" label-width="80px" class="cute-form">
                <el-form-item label="收件人" class="cute-form-item">
                  <el-input v-model="addressForm.name" placeholder="请输入收件人姓名" class="cute-input"/>
                </el-form-item>
                
                <el-form-item label="手机号码" class="cute-form-item">
                  <el-input v-model="addressForm.phone" placeholder="请输入手机号码" class="cute-input"/>
                </el-form-item>
                
                <el-form-item label="所在地区" class="cute-form-item">
                  <el-cascader
                    v-model="addressForm.region"
                    :options="regionOptions"
                    placeholder="请选择省/市/区"
                    class="cute-cascader"
                  />
                </el-form-item>
                
                <el-form-item label="详细地址" class="cute-form-item">
                  <el-input
                    v-model="addressForm.detail"
                    type="textarea"
                    placeholder="请输入详细地址信息，如街道、门牌号等"
                    class="cute-textarea"
                  />
                </el-form-item>
                
                <el-form-item label="邮政编码" class="cute-form-item">
                  <el-input v-model="addressForm.zipCode" placeholder="请输入邮政编码" class="cute-input"/>
                </el-form-item>
                
                <el-form-item>
                  <el-checkbox v-model="addressForm.isDefault" class="cute-checkbox">设为默认地址</el-checkbox>
                </el-form-item>
              </el-form>
              
              <template #footer>
                <el-button @click="addressDialogVisible = false" class="cute-button outline">取消</el-button>
                <el-button type="primary" @click="saveAddress" class="cute-button">保存</el-button>
              </template>
            </el-dialog>
          </div>
          
          <!-- 我的收藏 -->
          <div v-if="activeTab === 'favorites'" class="tab-content">
            <div class="section-header">
              <h2 class="section-title">我的收藏</h2>
            </div>
            
            <div v-if="favorites && favorites.length > 0" class="favorites-grid">
              <div v-for="product in favorites" :key="product.id" class="favorite-item">
                <ProductCard :product="product" />
              </div>
            </div>
            
            <div v-else class="empty-list">
              <el-empty description="暂无收藏商品" />
              <router-link to="/products">
                <el-button type="primary" class="cute-button">去购物</el-button>
              </router-link>
            </div>
          </div>
          
          <!-- 账号设置 -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <div class="section-header">
              <h2 class="section-title">账号设置</h2>
            </div>
            
            <div class="settings-section">
              <h3 class="settings-title">修改密码</h3>
              <el-form :model="passwordForm" label-width="120px" class="cute-form">
                <el-form-item label="当前密码" class="cute-form-item">
                  <el-input 
                    v-model="passwordForm.current" 
                    type="password" 
                    placeholder="请输入当前密码" 
                    show-password
                    class="cute-input"
                  />
                </el-form-item>
                
                <el-form-item label="新密码" class="cute-form-item">
                  <el-input 
                    v-model="passwordForm.new" 
                    type="password" 
                    placeholder="请输入新密码" 
                    show-password
                    class="cute-input"
                  />
                </el-form-item>
                
                <el-form-item label="确认新密码" class="cute-form-item">
                  <el-input 
                    v-model="passwordForm.confirm" 
                    type="password" 
                    placeholder="请再次输入新密码" 
                    show-password
                    class="cute-input"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="changePassword" class="cute-button">更新密码</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="divider"></div>
            
            <div class="settings-section">
              <h3 class="settings-title">通知设置</h3>
              <el-form :model="notificationSettings" label-width="120px" class="cute-form">
                <el-form-item label="订单更新" class="cute-form-item">
                  <el-switch 
                    v-model="notificationSettings.orderUpdates"
                    class="cute-switch"
                    active-color="#ff69b4"
                    inactive-color="#f5e9ff"
                  />
                </el-form-item>
                
                <el-form-item label="促销活动" class="cute-form-item">
                  <el-switch 
                    v-model="notificationSettings.promotions"
                    class="cute-switch"
                    active-color="#ff69b4"
                    inactive-color="#f5e9ff"
                  />
                </el-form-item>
                
                <el-form-item label="降价通知" class="cute-form-item">
                  <el-switch 
                    v-model="notificationSettings.priceDrops"
                    class="cute-switch"
                    active-color="#ff69b4"
                    inactive-color="#f5e9ff"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveNotificationSettings" class="cute-button">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="divider"></div>
            
            <div class="settings-section danger-section">
              <h3 class="settings-title danger">危险操作</h3>
              <div class="danger-buttons">
                <el-button type="danger" plain @click="confirmLogout" class="cute-button danger">退出登录</el-button>
                <el-button type="danger" @click="confirmDeleteAccount" class="cute-button danger-solid">注销账号</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useProductStore } from '../stores/products';
import ProductCard from '../components/product/ProductCard.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useFavoritesStore } from '../stores/favorites';
import { orderApi } from '../data';
import { User, Message, Iphone } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const productStore = useProductStore();
const favoritesStore = useFavoritesStore();

// 当前激活的标签页
const activeTab = ref('profile');

// 编辑模式
const editMode = ref(false);

// 初始化用户信息
const userName = computed(() => userStore.user?.name || '用户');
const userEmail = computed(() => userStore.user?.email || '');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

// 计算属性
const avatarUrl = computed(() => {
  // 优先使用本地存储的头像
  const savedAvatar = localStorage.getItem('userAvatar');
  if (savedAvatar) {
    return savedAvatar;
  }
  // 如果本地存储中没有头像，使用默认头像
  return '/images/avater.png';
});

// 在组件挂载时初始化数据
onMounted(() => {
  // 检查路由查询参数
  if (route.query.tab) {
    activeTab.value = route.query.tab.toString();
  }
  
  if (userStore.isLoggedIn) {    
    // 强制刷新收藏数据
    favoritesStore.initFavoritesFromStorage();
    
    // 获取用户订单数据
    fetchUserOrders();
  }
});

// 个人资料表单
const profileForm = reactive({
  name: userName.value,
  email: userEmail.value,
  phone: '13800138000',
  birthday: new Date('1990-01-01'),
  gender: 'other'
});

// 保存个人资料
const saveProfile = () => {
  userStore.updateUser({
    name: profileForm.name
  });
  
  ElMessage.success('个人资料已更新');
  editMode.value = false;
};

// 切换标签页
const handleTabChange = (key) => {
  activeTab.value = key;
  
  // 如果切换到收藏标签页，确保刷新收藏数据
  if (key === 'favorites') {
    // 强制重新获取收藏数据
    favoritesStore.initFavoritesFromStorage();
  }
};

// 订单相关
const orderStatus = ref('all');
const orders = ref([]);

// 获取用户订单
const fetchUserOrders = () => {
  if (!userStore.isLoggedIn) return;
  
  const userId = userStore.user?.id || 'guest';
  const result = orderApi.getUserOrders(userId);
  
  if (result.code === 200) {
    orders.value = result.data || [];
  } else {
    ElMessage.error('获取订单数据失败');
    // 如果API失败，保留一些默认订单作为示例
    orders.value = [
      {
        id: 'ORD20250510001',
        date: '2025-05-10',
        status: 'completed',
        items: [
          {
            id: 1,
            name: '可爱熊猫玩偶',
            price: 89.9,
            quantity: 1,
            image: 'https://img.alicdn.com/i3/1745647555/O1CN0136qaFW25gF5e2y6WA_!!1745647555.jpg'
          }
        ]
      }
    ];
  }
};

// 订单详情相关
const orderDetailVisible = ref(false);
const currentOrder = ref(null);

// 显示订单详情
const showOrderDetail = (order) => {
  currentOrder.value = order;
  orderDetailVisible.value = true;
};

// 确认收货
const confirmReceiveOrder = (index) => {
  ElMessageBox.confirm(
    '确认已收到商品？',
    '确认收货',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      const userId = userStore.user?.id || 'guest';
      const orderId = orders.value[index].id;
      
      // 调用API更新订单状态
      const result = orderApi.updateOrderStatus(userId, orderId, 'completed');
      
      if (result.code === 200) {
        // 更新本地状态
        orders.value[index].status = 'completed';
        ElMessage.success('已确认收货');
      } else {
        ElMessage.error(result.message || '操作失败');
      }
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 支付订单
const payOrder = (index) => {
  ElMessageBox.confirm(
    '确认支付该订单？',
    '订单支付',
    {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      const userId = userStore.user?.id || 'guest';
      const orderId = orders.value[index].id;
      
      // 调用API更新订单状态
      const result = orderApi.updateOrderStatus(userId, orderId, 'paid');
      
      if (result.code === 200) {
        // 更新本地状态
        orders.value[index].status = 'paid';
        ElMessage.success('订单支付成功，商家正在备货中');
      } else {
        ElMessage.error(result.message || '支付失败');
      }
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 删除订单
const deleteOrder = (index) => {
  ElMessageBox.confirm(
    '确定要删除该订单吗？删除后将无法恢复。',
    '删除订单',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      const userId = userStore.user?.id || 'guest';
      const orderId = orders.value[index].id;
      
      // 调用API删除订单
      const result = orderApi.deleteOrder(userId, orderId);
      
      if (result.code === 200) {
        // 更新本地状态
        orders.value.splice(index, 1);
        ElMessage.success('订单已删除');
      } else {
        ElMessage.error(result.message || '删除失败');
      }
    })
    .catch(() => {
      // 用户取消操作
    });
};

const filteredOrders = computed(() => {
  if (orderStatus.value === 'all') {
    return orders.value;
  } else {
    return orders.value.filter(order => order.status === orderStatus.value);
  }
});

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待付款';
    case 'paid': return '待发货';
    case 'shipped': return '待收货';
    case 'completed': return '已完成';
    default: return '未知状态';
  }
};

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'danger';
    case 'paid': return 'warning';
    case 'shipped': return 'primary';
    case 'completed': return 'success';
    default: return 'info';
  }
};

const getTotalItems = (order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
};

const getTotalPrice = (order) => {
  return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// 地址相关
const addresses = ref([
  {
    name: '张三',
    phone: '13800138000',
    region: ['北京市', '北京市', '海淀区'],
    detail: '中关村科技园区15号楼4单元501室',
    zipCode: '100080',
    isDefault: true
  },
  {
    name: '李四',
    phone: '13900139000',
    region: ['上海市', '上海市', '浦东新区'],
    detail: '张江高科技园区88号创新大厦2305室',
    zipCode: '201203',
    isDefault: false
  }
]);

const addressDialogVisible = ref(false);
const addressDialogTitle = ref('添加收货地址');
const currentEditIndex = ref(-1);

const addressForm = reactive({
  name: '',
  phone: '',
  region: [],
  detail: '',
  zipCode: '',
  isDefault: false
});

// 模拟的地区数据，实际项目中应该从API获取
const regionOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [{
      value: '北京市',
      label: '北京市',
      children: [
        { value: '东城区', label: '东城区' },
        { value: '西城区', label: '西城区' },
        { value: '朝阳区', label: '朝阳区' },
        { value: '海淀区', label: '海淀区' }
      ]
    }]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [{
      value: '上海市',
      label: '上海市',
      children: [
        { value: '黄浦区', label: '黄浦区' },
        { value: '徐汇区', label: '徐汇区' },
        { value: '浦东新区', label: '浦东新区' }
      ]
    }]
  }
];

const formatAddress = (address) => {
  return `${address.region.join(' ')} ${address.detail} ${address.zipCode}`;
};

const addNewAddress = () => {
  addressDialogTitle.value = '添加收货地址';
  currentEditIndex.value = -1;
  
  // 重置表单
  Object.assign(addressForm, {
    name: '',
    phone: '',
    region: [],
    detail: '',
    zipCode: '',
    isDefault: false
  });
  
  addressDialogVisible.value = true;
};

const editAddress = (index) => {
  addressDialogTitle.value = '编辑收货地址';
  currentEditIndex.value = index;
  
  // 填充表单
  const address = addresses.value[index];
  Object.assign(addressForm, {
    name: address.name,
    phone: address.phone,
    region: [...address.region],
    detail: address.detail,
    zipCode: address.zipCode,
    isDefault: address.isDefault
  });
  
  addressDialogVisible.value = true;
};

const saveAddress = () => {
  // 验证表单 (简单示例)
  if (!addressForm.name || !addressForm.phone || !addressForm.region.length || !addressForm.detail) {
    ElMessage.warning('请填写完整的地址信息');
    return;
  }
  
  const newAddress = {
    name: addressForm.name,
    phone: addressForm.phone,
    region: [...addressForm.region],
    detail: addressForm.detail,
    zipCode: addressForm.zipCode,
    isDefault: addressForm.isDefault
  };
  
  // 如果设置为默认地址，需要取消其他地址的默认标记
  if (newAddress.isDefault) {
    addresses.value.forEach(address => {
      address.isDefault = false;
    });
  }
  
  // 新增或更新地址
  if (currentEditIndex.value === -1) {
    // 新增
    addresses.value.push(newAddress);
    ElMessage.success('地址添加成功');
  } else {
    // 更新
    addresses.value[currentEditIndex.value] = newAddress;
    ElMessage.success('地址更新成功');
  }
  
  addressDialogVisible.value = false;
};

const deleteAddress = (index) => {
  ElMessageBox.confirm(
    '确定要删除这个地址吗？',
    '删除地址',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      addresses.value.splice(index, 1);
      ElMessage.success('地址已删除');
    })
    .catch(() => {
      // 用户取消删除
    });
};

const setDefaultAddress = (index) => {
  // 取消之前的默认地址
  addresses.value.forEach(address => {
    address.isDefault = false;
  });
  
  // 设置新的默认地址
  addresses.value[index].isDefault = true;
  ElMessage.success('默认地址已更新');
};

// 收藏相关
const favorites = computed(() => {
  return favoritesStore.favorites;
});

// 账号设置相关
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

const notificationSettings = reactive({
  orderUpdates: true,
  promotions: false,
  priceDrops: true
});

const changePassword = () => {
  // 简单验证
  if (!passwordForm.current) {
    ElMessage.warning('请输入当前密码');
    return;
  }
  
  if (!passwordForm.new) {
    ElMessage.warning('请输入新密码');
    return;
  }
  
  if (passwordForm.new !== passwordForm.confirm) {
    ElMessage.error('两次输入的新密码不一致');
    return;
  }
  
  // 模拟更新密码
  ElMessage.success('密码已更新');
  
  // 清空表单
  passwordForm.current = '';
  passwordForm.new = '';
  passwordForm.confirm = '';
};

const saveNotificationSettings = () => {
  ElMessage.success('通知设置已保存');
};

const confirmLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '退出登录',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      userStore.logout();
      router.push('/');
      ElMessage.success('已退出登录');
    })
    .catch(() => {
      // 用户取消操作
    });
};

const confirmDeleteAccount = () => {
  ElMessageBox.confirm(
    '注销账号将删除您的所有个人数据，此操作无法撤销。确定要继续吗？',
    '注销账号',
    {
      confirmButtonText: '确认注销',
      cancelButtonText: '取消',
      type: 'error'
    }
  )
    .then(() => {
      // 模拟注销账号
      userStore.logout();
      router.push('/');
      ElMessage.success('账号已注销');
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 头像上传相关
const fileInput = ref(null);

const uploadAvatar = () => {
  fileInput.value.click();
};

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
      // 更新头像到本地存储和用户状态
      localStorage.setItem('userAvatar', e.target.result);
      userStore.updateUser({ avatar: e.target.result });
      ElMessage.success('头像更新成功');
    };
    reader.onerror = () => {
      ElMessage.error('读取文件失败');
    };
    reader.readAsDataURL(file);
  }
};

const handleAvatarError = () => {
  // 当头像加载失败时，显示默认头像
  return true; // 阻止默认的错误提示
};
</script>

<style scoped>
.profile-page {
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

.page-header {
  text-align: center;
  margin-bottom: 24px;
  animation: title-appear 0.8s ease-out;
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

.profile-content {
  display: flex;
  gap: 24px;
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

/* 侧边栏 */
.profile-sidebar {
  flex: 1;
  max-width: 280px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.user-info {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
}

.user-avatar {
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  color: white;
  font-size: 1.5rem;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar-container {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
  cursor: pointer;
  transition: transform 0.3s;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar-hover-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}

.avatar-container:hover .avatar-hover-text {
  opacity: 1;
}

.user-details {
  text-align: center;
}

.user-name {
  font-size: 1.2rem;
  margin-bottom: 4px;
  color: #654972;
  font-weight: 600;
}

.user-email {
  color: #b39eb5;
  font-size: 0.9rem;
}

.profile-menu {
  border-right: none;
  background-color: transparent;
  --el-menu-active-color: #ff69b4;
  --el-menu-text-color: #654972;
  --el-menu-hover-bg-color: rgba(255, 182, 193, 0.1);
}

.profile-menu :deep(.el-menu-item.is-active) {
  color: #ff69b4;
  background-color: rgba(255, 182, 193, 0.2);
}

.profile-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 182, 193, 0.1);
}

/* 主内容区 */
.profile-main {
  flex: 3;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  padding: 24px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
}

.section-title {
  font-size: 1.4rem;
  color: #ff69b4;
  margin: 0;
  font-weight: 600;
}

.tab-content {
  min-height: 500px;
}

/* 表单样式 */
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
  color: #ff69b4;
  margin-right: 8px;
  font-size: 18px;
}

/* 覆盖Element Plus默认输入框样式 */
.cute-form-item :deep(.el-input__wrapper) {
  border: none !important;
  box-shadow: none !important;
  padding: 1px 11px !important;
  border-radius: 50px !important;
  background-color: transparent !important;
}

.cute-input :deep(.el-input__prefix) {
  left: 15px;
  z-index: 10;
}

.cute-input :deep(.el-input__prefix-inner) {
  color: #ff69b4;
  margin-right: 8px;
  font-size: 18px;
}

.cute-input :deep(.el-input__suffix) {
  right: 15px;
}

/* 日期选择器样式 */
.date-picker :deep(.el-input__wrapper) {
  border-radius: 50px !important;
  padding: 0 15px !important;
  background-color: white !important;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.date-picker :deep(.el-input__wrapper.is-focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 10px rgba(255, 182, 193, 0.4) !important;
}

.date-picker :deep(.el-input__inner) {
  color: #654972;
  height: 44px;
}

/* 单选按钮样式 */
.el-radio-group :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #ff69b4;
  border-color: #ff69b4;
}

.el-radio-group :deep(.el-radio__input .el-radio__inner) {
  border: 2px solid #f5e9ff;
  transition: all 0.3s ease;
}

.el-radio-group :deep(.el-radio__label) {
  color: #654972;
}

/* 按钮样式 */
.cute-button {
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
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

.cute-button.el-button--plain {
  background: transparent;
  border: 2px solid #ffb6c1;
  color: #ff69b4;
}

.cute-button.el-button--plain:hover {
  border-color: #ff69b4;
  color: #ff69b4;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-sidebar {
    max-width: none;
    margin-bottom: 24px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 16px;
  }
  
  .user-avatar {
    margin-bottom: 0;
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
  }
  
  .profile-menu {
    display: flex;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.7rem;
  }
  
  .profile-main {
    padding: 16px;
  }
  
  .address-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .address-actions {
    margin-top: 16px;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
  
  .danger-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .settings-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .profile-main {
    padding: 12px;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
}

/* 订单列表样式 */
.order-tabs {
  margin-bottom: 24px;
}

.cute-tabs :deep(.el-tabs__item) {
  color: #b39eb5;
  font-size: 1rem;
}

.cute-tabs :deep(.el-tabs__item.is-active) {
  color: #ff69b4;
  font-weight: 600;
}

.cute-tabs :deep(.el-tabs__active-bar) {
  background-color: #ff69b4;
}

.cute-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(255, 182, 193, 0.3);
}

.order-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
}

.order-info {
  display: flex;
  gap: 16px;
}

.order-id {
  font-weight: 600;
  color: #654972;
}

.order-date {
  color: #b39eb5;
}

.cute-tag {
  border-radius: 50px;
  padding: 0 12px;
  height: 26px;
  line-height: 26px;
  font-weight: 500;
}

.cute-tag.el-tag--success {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.cute-tag.el-tag--primary {
  background-color: rgba(255, 105, 180, 0.1);
  border-color: rgba(255, 105, 180, 0.2);
  color: #ff69b4;
}

.cute-tag.el-tag--warning {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}

.cute-tag.el-tag--danger {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}

.order-items {
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.7);
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(255, 182, 193, 0.3);
}

.order-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  margin-bottom: 8px;
  font-weight: 500;
  color: #654972;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  color: #b39eb5;
  font-size: 0.9rem;
}

.item-price {
  color: #ff69b4;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 182, 193, 0.2);
}

.order-total {
  color: #654972;
}

.total-price {
  font-weight: bold;
  color: #ff69b4;
  font-size: 1.1rem;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.cute-button.success {
  background: linear-gradient(45deg, #67c23a, #95d475);
}

.cute-button.success:hover {
  background: linear-gradient(45deg, #5daf34, #8cca6d);
}

/* 空状态 */
.empty-list {
  padding: 48px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  margin: 20px 0;
  border: 1px dashed rgba(255, 182, 193, 0.3);
}

.empty-list :deep(.el-empty__description) {
  color: #b39eb5;
}

.empty-list .el-button {
  margin-top: 16px;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
  color: white;
}

.empty-list .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
}

/* 地址列表样式 */
.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transition: all 0.3s ease;
}

.address-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.15);
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.recipient-name {
  font-weight: 600;
  color: #654972;
  font-size: 1.05rem;
}

.recipient-phone {
  color: #b39eb5;
}

.address-details {
  color: #654972;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cute-button.danger {
  background: transparent;
  border: 2px solid #f56c6c;
  color: #f56c6c;
}

.cute-button.danger:hover {
  border-color: #f56c6c;
  color: #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
}

.cute-button.outline {
  background: transparent;
  border: 2px solid #b39eb5;
  color: #654972;
}

.cute-button.outline:hover {
  border-color: #ff69b4;
  color: #ff69b4;
}

/* 对话框样式 */
.cute-dialog :deep(.el-dialog__header) {
  text-align: center;
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
  padding-bottom: 16px;
}

.cute-dialog :deep(.el-dialog__title) {
  color: #ff69b4;
  font-weight: 600;
}

.cute-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #b39eb5;
}

.cute-dialog :deep(.el-dialog__body) {
  padding: 20px 30px;
}

.cute-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid rgba(255, 182, 193, 0.3);
  padding-top: 16px;
}

/* 级联选择器样式 */
.cute-cascader :deep(.el-input__wrapper) {
  border-radius: 50px;
  border: 2px solid #f5e9ff !important;
  box-shadow: none !important;
  background-color: white !important;
  height: 48px !important;
}

.cute-cascader :deep(.el-input__inner) {
  color: #654972 !important;
  height: 48px !important;
}

/* 文本域样式 */
.cute-textarea :deep(.el-textarea__inner) {
  border-radius: 16px;
  border: 2px solid #f5e9ff;
  background-color: #fff;
  transition: all 0.3s;
  color: #654972;
  padding: 12px 16px;
}

.cute-textarea :deep(.el-textarea__inner:focus) {
  border-color: #ffb6c1;
  box-shadow: 0 0 10px rgba(255, 182, 193, 0.4);
  outline: none;
}

/* 复选框样式 */
.cute-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff69b4;
  border-color: #ff69b4;
}

.cute-checkbox :deep(.el-checkbox__input .el-checkbox__inner) {
  border-radius: 50%;
  border: 2px solid #ffb6c1;
  background-color: white;
  transition: all 0.3s ease;
}

.cute-checkbox :deep(.el-checkbox__label) {
  color: #654972;
}

/* 收藏列表样式 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.favorite-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transform: translateY(0);
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
}

/* 账号设置样式 */
.settings-section {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 182, 193, 0.2);
  transition: all 0.3s ease;
}

.settings-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #ff69b4;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(255, 182, 193, 0.3);
}

.settings-title.danger {
  color: #f56c6c;
  border-bottom-color: rgba(245, 108, 108, 0.3);
}

.divider {
  height: 1px;
  margin: 24px 0;
  background: linear-gradient(to right, transparent, rgba(255, 182, 193, 0.5), transparent);
}

/* 开关样式 */
.cute-switch :deep(.el-switch__core) {
  border-radius: 100px;
  border: 2px solid #f5e9ff;
}

.cute-switch :deep(.el-switch__core .el-switch__action) {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 危险操作按钮 */
.danger-section {
  border: 1px solid rgba(245, 108, 108, 0.2);
}

.danger-buttons {
  display: flex;
  gap: 16px;
}

.cute-button.danger-solid {
  background: linear-gradient(45deg, #f56c6c, #fab6b6);
  border: none;
  color: white;
}

.cute-button.danger-solid:hover {
  background: linear-gradient(45deg, #f34a4a, #f89b9b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 108, 108, 0.3);
}

/* 订单详情对话框样式 */
.order-detail-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.order-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #654972;
}

.detail-divider {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(to right, transparent, rgba(255, 182, 193, 0.5), transparent);
}

.detail-subtitle {
  color: #ff69b4;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 1.1rem;
}

.detail-items {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.detail-item-image {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 16px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.detail-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item-name {
  font-weight: 600;
  color: #654972;
}

.detail-item-price {
  color: #ff69b4;
}

.detail-item-quantity {
  color: #b39eb5;
  font-size: 0.9rem;
}

.detail-item-subtotal {
  color: #654972;
  font-weight: 500;
}

.detail-summary {
  background-color: rgba(255, 248, 250, 0.7);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-summary-row {
  display: flex;
  justify-content: space-between;
  color: #654972;
}

.detail-total {
  font-weight: 600;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 182, 193, 0.4);
  margin-top: 5px;
}

.detail-total-price {
  color: #ff69b4;
  font-size: 1.2rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .order-detail-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto !important;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-item-image {
    margin-bottom: 10px;
  }
  
  .detail-item-subtotal {
    align-self: flex-end;
    margin-top: 10px;
  }
}

/* 提交按钮样式 */
.submit-button {
  border-radius: 50px;
  background: linear-gradient(45deg, #ff69b4, #ffb6c1);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  transition: all 0.3s;
  padding: 10px 30px;
  font-size: 16px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
  background: linear-gradient(45deg, #ff5aab, #ffafbc);
}
</style>