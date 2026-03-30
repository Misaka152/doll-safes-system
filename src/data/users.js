// 从数据库转换的用户数据
export const users = [
  {
    id: 1,
    name: '测试用户',
    email: 'test@example.com',
    password: 'password123',
    avatar: null,
    createdAt: '2025-10-01T00:00:00.000Z',
    updatedAt: '2025-10-01T00:00:00.000Z',
    lastLoginAt: null,
    status: 'active'
  },
  {
    id: 2,
    name: '管理员',
    email: 'admin@example.com',
    password: 'admin123',
    avatar: null,
    createdAt: '2025-10-01T00:00:00.000Z',
    updatedAt: '2025-10-01T00:00:00.000Z',
    lastLoginAt: null,
    status: 'active'
  }
];

// 模拟登录函数
export function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // 返回用户信息，但排除密码
    const { password, ...userWithoutPassword } = user;
    return {
      code: 200,
      message: '登录成功',
      data: userWithoutPassword
    };
  }
  return {
    code: 401,
    message: '邮箱或密码不正确',
    data: null
  };
} 