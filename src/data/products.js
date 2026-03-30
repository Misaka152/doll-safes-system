// 产品数据
export const products = [
  {
    id: 1,
    name: '可爱熊猫玩偶',
    price: 89.9,
    originalPrice: 109.9,
    description: '超柔软的熊猫玩偶，采用优质面料，触感舒适，适合各年龄段人群。',
    longDescription: '这款熊猫玩偶采用高品质PP棉填充，确保柔软度的同时保持良好的弹性和耐用性。外层使用优质短毛绒面料，手感细腻柔滑，安全无异味。玩偶造型可爱，神态生动，是陪伴、装饰和送礼的理想选择。',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN013sX4Xs1IcerqnLkho_!!2216212680914-0-cib.310x310.jpg',
    categoryId: 1,
    category: '动物玩偶',
    stock: 50,
    rating: 4.8,
    reviewCount: 126,
    isNew: true,
    isFeatured: true,
    tags: ['熊猫', '毛绒玩具', '可爱'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN013sX4Xs1IcerqnLkho_!!2216212680914-0-cib.310x310.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01jR7KpX2AeTmbtYUYb_!!2208222098228-0-cib.jpg',
      'https://img.alicdn.com/i2/1666043608/O1CN01vEgHm81cWVkHO9xEg_!!1666043608.jpg'
    ]
  },
  {
    id: 2,
    name: '星际冒险家娃娃',
    price: 128.0,
    originalPrice: 158.0,
    description: '限量版星际冒险家系列玩偶，精致的宇航服细节，让孩子探索无限宇宙。',
    longDescription: '星际冒险家娃娃是我们限量推出的太空主题系列玩偶。每个玩偶都穿着精心设计的宇航服，配有可拆卸的头盔和氧气背包。面部表情生动活泼，激发孩子们对太空探索的想象力。这款玩偶采用环保材料制作，安全耐用，适合3岁以上儿童。',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01IG6HVR26g4kjKWezu_!!2217498937690-0-cib.jpg',
    categoryId: 2,
    category: '主题玩偶',
    stock: 25,
    rating: 4.9,
    reviewCount: 78,
    isNew: true,
    isFeatured: true,
    tags: ['太空', '宇航员', '限量版'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01IG6HVR26g4kjKWezu_!!2217498937690-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01fvJOem21pcm5SpFZn_!!2921717034-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01AKlZxh2EQ3aNwedEx_!!2211054928738-0-cib.jpg'
    ]
  },
  {
    id: 3,
    name: '治愈系小兔子',
    price: 69.9,
    originalPrice: 89.9,
    description: '轻松疗愈系列的小兔子玩偶，柔软舒适，让您在忙碌的一天后得到放松。',
    longDescription: '这款治愈系小兔子玩偶是我们专为现代都市人设计的心灵伴侣。采用特殊处理的超柔棉花填充，抱在怀里有助于缓解压力和焦虑。兔子耳朵和尾巴经过特别设计，手感极佳。搭配淡雅的粉色和米色，给人以温暖和舒适的感觉。',
    image: 'https://img.alicdn.com/i4/2201271989089/O1CN01U3AOln2H0oXuDghyP_!!2201271989089.jpg',
    categoryId: 1,
    category: '动物玩偶',
    stock: 80,
    rating: 4.7,
    reviewCount: 204,
    isNew: false,
    isFeatured: true,
    tags: ['兔子', '治愈', '柔软'],
    images: [
      'https://img.alicdn.com/i4/2201271989089/O1CN01U3AOln2H0oXuDghyP_!!2201271989089.jpg',
      'https://img.alicdn.com/i1/2201271989089/O1CN01Z8ohRL2H0oXpuMgVC_!!2201271989089.jpg',
      'https://img.alicdn.com/bao/uploaded/i4/109398470/O1CN01irNkwD2CRJRpwa5w4_!!109398470.jpg'
    ]
  },
  {
    id: 4,
    name: '梦幻独角兽',
    price: 119.0,
    originalPrice: 149.0,
    description: '彩虹色的梦幻独角兽，闪亮的角和璀璨的鬃毛，成为孩子的梦幻伙伴。',
    longDescription: '梦幻独角兽玩偶采用七彩渐变色设计，角部采用特殊工艺制作，在光线下会闪闪发光。绒毛柔软蓬松，鬃毛和尾巴采用丝带材质，触感舒适。每个独角兽都有独特的面部表情，充满童话般的魅力，是儿童房间装饰和游戏的理想伙伴。',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01oXbUBU1f7GzJDYoKI_!!2218018093959-0-cib.310x310.jpg',
    categoryId: 3,
    category: '幻想生物',
    stock: 35,
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    isFeatured: true,
    tags: ['独角兽', '彩虹', '梦幻'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01oXbUBU1f7GzJDYoKI_!!2218018093959-0-cib.310x310.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01DuqRZe1DnaJ67EQp2_!!2210353950261-0-cib.310x310.jpg',
      'https://cbu01.alicdn.com/img/ibank/2019/051/398/11455893150_1369725111.jpg'
    ]
  },
  {
    id: 5,
    name: '复古泰迪熊',
    price: 159.0,
    originalPrice: 199.0,
    description: '经典复古设计的泰迪熊，精致的缝线和古朴的风格，收藏家的最爱。',
    longDescription: '这款复古泰迪熊以20世纪初的经典设计为灵感，采用优质棉麻混纺面料，触感独特且耐用。眼睛和鼻子使用传统的纽扣材质，赋予其古朴的气息。每只泰迪熊都经过手工缝制，关节可活动，适合收藏或装饰。配有编号和精美的礼盒包装。',
    image: 'https://cbu01.alicdn.com/img/ibank/2019/349/863/11325368943_140747339.jpg',
    categoryId: 4,
    category: '收藏玩偶',
    stock: 20,
    rating: 4.8,
    reviewCount: 89,
    isNew: false,
    isFeatured: false,
    tags: ['泰迪熊', '复古', '收藏级'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/2019/349/863/11325368943_140747339.jpg',
      'https://cbu01.alicdn.com/img/ibank/2019/844/884/11260488448_140747339.jpg',
      'https://cbu01.alicdn.com/img/ibank/2020/213/937/23034739312_326545119.jpg'
    ]
  },
  {
    id: 6,
    name: '海洋精灵娃娃',
    price: 99.9,
    originalPrice: 129.9,
    description: '海洋主题的可爱娃娃，带有贝壳和珊瑚元素，让孩子爱上海洋世界。',
    longDescription: '海洋精灵娃娃系列融合了海洋元素与童话风格，每个娃娃都有独特的海洋特征，如珊瑚发饰、贝壳装饰或海星图案。采用环保染料和可水洗材料制作，色彩鲜艳持久。这款玩偶不仅是玩具，也是向孩子们传递海洋保护意识的教育工具。',
    image: 'https://static.ctoy.com.cn/image/2023/06/20230619/b6d53274256f2b00a4a643ee583bec19.jpg',
    categoryId: 2,
    category: '主题玩偶',
    stock: 40,
    rating: 4.6,
    reviewCount: 112,
    isNew: false,
    isFeatured: true,
    tags: ['海洋', '美人鱼', '教育'],
    images: [
      'https://static.ctoy.com.cn/image/2023/06/20230619/b6d53274256f2b00a4a643ee583bec19.jpg',
      'https://static.ctoy.com.cn/image/2023/06/20230619/eb6097f2cb937b79caaa13d7da766945.jpg',
      'https://cbu01.alicdn.com/img/ibank/2014/044/158/1264851440_1776133196.jpg'
    ]
  },
  {
    id: 7,
    name: '呆萌树懒玩偶',
    price: 75.0,
    originalPrice: 95.0,
    description: '慵懒可爱的树懒造型，慢生活的最佳代言人，陪你一起放慢节奏。',
    longDescription: '这款树懒玩偶完美还原了树懒憨态可掬的形象，采用环保短绒面料，填充超柔软PP棉。特别设计的可调节手臂可以挂在各种地方，无论是床头、书包还是办公椅都能陪伴左右。',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01e9PUN81dXiRmUjQIA_!!2211237063746-0-cib.jpg',
    categoryId: 1,
    category: '动物玩偶',
    stock: 60,
    rating: 4.7,
    reviewCount: 93,
    isNew: true,
    isFeatured: false,
    tags: ['树懒', '呆萌', '解压'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01e9PUN81dXiRmUjQIA_!!2211237063746-0-cib.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01Po6s1729f6jCPxvGM_!!2200724218094-0-cib.310x310.jpg'
    ]
  },
  {
    id: 8,
    name: '北极熊宝宝',
    price: 109.0,
    originalPrice: 139.0,
    description: '雪白柔软的北极熊玩偶，蓝眼睛设计，萌化人心的冬季温暖伴侣。',
    longDescription: '北极熊宝宝玩偶采用特殊仿雪貂绒面料，触感冰凉顺滑。眼睛使用安全环保的玻璃珠材质，在光线下会呈现梦幻的蓝色。腹部缝有爱心图案，传递保护北极生态的环保理念。',
    image: 'https://cbu01.alicdn.com/img/ibank/2020/254/588/17981885452_874399895.jpg',
    categoryId: 1,
    category: '动物玩偶',
    stock: 45,
    rating: 4.8,
    reviewCount: 67,
    isNew: true,
    isFeatured: true,
    tags: ['北极熊', '冬季', '环保'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/2020/254/588/17981885452_874399895.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01IUzCv11tBJ1Zo2ls7_!!1678365863-0-cib.310x310.jpg'
    ]
  },
  {
    id: 9,
    name: '恐龙探险队',
    price: 138.0,
    originalPrice: 168.0,
    description: '考古学家主题玩偶套装，包含工具和小恐龙化石，激发孩子的探索精神。',
    longDescription: '这套恐龙探险玩偶包含一个可动关节的考古学家玩偶和三个迷你恐龙模型。配件包括放大镜、小锤子和化石挖掘板，通过角色扮演游戏培养孩子的科学兴趣。所有材料均通过国际安全认证。',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01TIsV0Z1IGDZvT0ldq_!!2678750865-0-cib.310x310.jpg',
    categoryId: 2,
    category: '主题玩偶',
    stock: 30,
    rating: 4.9,
    reviewCount: 54,
    isNew: true,
    isFeatured: true,
    tags: ['恐龙', '考古', '教育'],
    images: [
      'https://cbu01.alicdn.com/img/ibank/O1CN01TIsV0Z1IGDZvT0ldq_!!2678750865-0-cib.310x310.jpg',
      'https://cbu01.alicdn.com/img/ibank/O1CN01wNASTb2FZVT1qnwuD_!!2829888894-0-cib.jpg'
    ]
  },
  {
    id: 10,
    name: '魔法小精灵',
    price: 88.0,
    originalPrice: 108.0,
    description: '会发光的魔法小精灵，翅膀采用特殊材质，在暗处会发出柔和的光芒。',
    longDescription: '这款魔法小精灵玩偶的翅膀内置安全LED灯，通过USB充电，提供三种亮度调节。身体采用抗菌面料，特别适合儿童睡前陪伴。精灵的头发可以梳理造型，培养孩子的动手能力。',
    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.mEKBEl1sehft7OLDS2l6SgHaHa?cb=iwc1&rs=1&pid=ImgDetMain',
    categoryId: 3,
    category: '幻想生物',
    stock: 55,
    rating: 4.6,
    reviewCount: 124,
    isNew: false,
    isFeatured: true,
    tags: ['精灵', '发光', '魔法'],
    images: [
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.mEKBEl1sehft7OLDS2l6SgHaHa?cb=iwc1&rs=1&pid=ImgDetMain',
      'https://cbu01.alicdn.com/img/ibank/O1CN01zqiDeS1Y2xwq6z7PW_!!2200613013002-0-cib.310x310.jpg'
    ]
  },
  {
    id: 11,
    name: '宫廷系列人偶',
    price: 299.0,
    originalPrice: 399.0,
    description: '18世纪欧洲宫廷风格收藏级人偶，手工缝制的华服与精致配件重现历史风貌。',
    longDescription: '这套宫廷人偶系列由专业历史服饰设计师参与创作，每个细节都还原了洛可可时期的服装特色。人偶采用陶瓷头部和关节可动的布艺身体，服装可单独拆卸收藏。配套展示盒内附历史背景卡片。',
    image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.8VHwswdaehxSanbqkwYtcQHaHa?cb=iwc1&rs=1&pid=ImgDetMain',
    categoryId: 4,
    category: '收藏玩偶',
    stock: 15,
    rating: 4.9,
    reviewCount: 42,
    isNew: true,
    isFeatured: false,
    tags: ['宫廷', '收藏级', '手工'],
    images: [
      'https://tse4-mm.cn.bing.net/th/id/OIP-C.8VHwswdaehxSanbqkwYtcQHaHa?cb=iwc1&rs=1&pid=ImgDetMain',
      'https://cbu01.alicdn.com/img/ibank/O1CN011xem4L1WbeazghE99_!!2759282807-0-cib.310x310.jpg'
    ]
  },
  {
    id: 12,
    name: '蒸汽朋克机械熊',
    price: 349.0,
    originalPrice: 499.0,
    description: '限量版蒸汽朋克风格机械熊，精铜齿轮与复古皮革的完美结合，收藏家必备珍品。',
    longDescription: '这款蒸汽朋克机械熊由专业模型师手工打造，主体采用做旧铜质配件与优质植鞣革组合而成。熊体内置12个可动齿轮结构，背部有发条装置（装饰用），眼部镶嵌仿古玻璃镜片。每只熊都有独立编号证书，全球限量500体。',
    image: 'https://img95.699pic.com/photo/60061/1537.jpg_wh860.jpg',
    categoryId: 4,
    category: '收藏玩偶',
    stock: 8,
    rating: 5.0,
    reviewCount: 36,
    isNew: true,
    isFeatured: true,
    tags: ['蒸汽朋克', '机械', '限量版'],
    images: [
      'https://img95.699pic.com/photo/60061/1537.jpg_wh860.jpg',
      'https://img95.699pic.com/photo/60066/7669.jpg_wh860.jpg',
      'https://5b0988e595225.cdn.sohucs.com/images/20190719/89b58a272ead48ee887b52e2d7acbd28.jpeg'
    ]
  }
];

// 获取所有产品函数
export function getProducts() {
  return {
    code: 200,
    message: "获取成功",
    data: products.map(product => {
      // 返回列表视图需要的数据格式
      const { longDescription, images, tags, ...productData } = product;
      return productData;
    })
  };
}

// 获取产品详情函数
export function getProductById(id) {
  const product = products.find(p => p.id === Number(id));
  if (product) {
    return {
      code: 200,
      message: "获取成功",
      data: {
        ...product,
        additionalImages: product.images.join(', ')
      }
    };
  }
  return {
    code: 404,
    message: "商品不存在",
    data: null
  };
}

// 根据分类获取产品
export function getProductsByCategory(categoryId) {
  const filteredProducts = products.filter(p => p.categoryId === Number(categoryId));
  return {
    code: 200,
    message: "获取成功",
    data: filteredProducts.map(product => {
      const { longDescription, images, tags, ...productData } = product;
      return productData;
    })
  };
}

// 获取新品
export function getNewProducts() {
  const newProducts = products.filter(p => p.isNew);
  return {
    code: 200,
    message: "获取成功",
    data: newProducts.map(product => {
      const { longDescription, images, tags, ...productData } = product;
      return productData;
    })
  };
}

// 获取推荐产品
export function getFeaturedProducts() {
  const featuredProducts = products.filter(p => p.isFeatured);
  return {
    code: 200,
    message: "获取成功",
    data: featuredProducts.map(product => {
      const { longDescription, images, tags, ...productData } = product;
      return productData;
    })
  };
} 