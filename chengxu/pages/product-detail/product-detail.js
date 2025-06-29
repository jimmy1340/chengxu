const app = getApp()

Page({
  data: {
    productId: null,
    product: {},
    selectedOptions: {},
    isFavorite: false,
    reviews: [],
    averageRating: 0,
    recommendedProducts: []
  },

  onLoad(options) {
    const productId = options.id;
    this.setData({ productId });
    this.loadProductDetail(productId);
    this.loadReviews(productId);
    this.loadRecommendedProducts();
  },

  onShow() {
    // 检查收藏状态
    this.checkFavoriteStatus();
  },

  // 加载产品详情
  loadProductDetail(productId) {
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟API调用
    setTimeout(() => {
      const mockProduct = {
        id: productId || 1,
        name: 'Lady Dior 限量手袋',
        price: '35000',
        originalPrice: '38000',
        stock: 8,
        totalStock: 100,
        description: '经典Lady Dior手袋的限量版本，采用意大利顶级小牛皮制作，搭配标志性的藤格纹设计和精致的D.I.O.R.挂饰。每一个细节都体现着法式优雅与精湛工艺的完美结合。',
        tags: ['限量版', '意大利制造', '真皮', '手工缝制'],
        images: [
          '/images/product1-1.jpg',
          '/images/product1-2.jpg',
          '/images/product1-3.jpg',
          '/images/product1-4.jpg'
        ],
        specifications: [
          { name: '尺寸', value: '24 x 20 x 11 cm' },
          { name: '材质', value: '意大利小牛皮' },
          { name: '颜色', value: '经典黑色' },
          { name: '五金', value: '金色金属配件' },
          { name: '内衬', value: '丝绸内衬' },
          { name: '产地', value: '意大利' }
        ],
        story: {
          image: '/images/dior-story-detail.jpg',
          content: '1995年，Lady Dior手袋诞生于Dior工坊的匠心独运。这款手袋以其独特的藤格纹设计和优雅的轮廓，迅速成为时尚界的经典之作。本次限量版在保持经典设计的基础上，加入了更多精致的细节处理，每一针每一线都体现着法式奢华的精神内核。'
        },
        options: [
          {
            name: '颜色',
            values: [
              { value: 'black', label: '经典黑' },
              { value: 'red', label: '迪奥红' },
              { value: 'beige', label: '象牙白' }
            ]
          },
          {
            name: '尺寸',
            values: [
              { value: 'small', label: '小号' },
              { value: 'medium', label: '中号' },
              { value: 'large', label: '大号' }
            ]
          }
        ]
      };

      this.setData({ product: mockProduct });
      wx.hideLoading();
    }, 800);
  },

  // 加载用户评价
  loadReviews(productId) {
    const mockReviews = [
      {
        id: 1,
        username: 'L***a',
        avatar: '/images/avatar1.jpg',
        rating: 5,
        content: '质量非常好，做工精致，真的很值得购买！包装也很精美，送给自己的生日礼物，非常满意。',
        createTime: '2024-01-15'
      },
      {
        id: 2,
        username: 'S***y',
        avatar: '/images/avatar2.jpg',
        rating: 5,
        content: '奢华典雅，品质上乘。客服服务也很贴心，配送很快。这就是我想要的那种高端质感。',
        createTime: '2024-01-10'
      },
      {
        id: 3,
        username: 'M***i',
        avatar: '/images/avatar3.jpg',
        rating: 4,
        content: '包包很漂亮，材质手感都很棒。唯一就是价格确实不便宜，不过一分价钱一分货。',
        createTime: '2024-01-08'
      }
    ];

    const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round(totalRating / mockReviews.length);

    this.setData({
      reviews: mockReviews,
      averageRating
    });
  },

  // 加载推荐产品
  loadRecommendedProducts() {
    const mockRecommended = [
      {
        id: 2,
        name: 'J\'adore 香水礼盒',
        price: '1580',
        image: '/images/product2.jpg'
      },
      {
        id: 3,
        name: 'Dior 珠宝系列',
        price: '128000',
        image: '/images/product3.jpg'
      },
      {
        id: 4,
        name: 'Dior 丝巾',
        price: '3800',
        image: '/images/product4.jpg'
      }
    ];

    this.setData({
      recommendedProducts: mockRecommended
    });
  },

  // 选择产品规格
  selectOption(e) {
    const { name, value } = e.currentTarget.dataset;
    const selectedOptions = { ...this.data.selectedOptions };
    selectedOptions[name] = value;
    
    this.setData({ selectedOptions });
  },

  // 图片预览
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.product.images
    });
  },

  // 切换收藏状态
  toggleFavorite() {
    const isFavorite = !this.data.isFavorite;
    this.setData({ isFavorite });

    // 模拟收藏API调用
    const action = isFavorite ? '收藏' : '取消收藏';
    wx.showToast({
      title: `${action}成功`,
      icon: 'success'
    });

    // 这里可以调用实际的收藏API
    this.saveFavoriteStatus(isFavorite);
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    // 模拟检查收藏状态
    const isFavorite = wx.getStorageSync(`favorite_${this.data.productId}`) || false;
    this.setData({ isFavorite });
  },

  // 保存收藏状态
  saveFavoriteStatus(isFavorite) {
    wx.setStorageSync(`favorite_${this.data.productId}`, isFavorite);
  },

  // 跳转到预订页面
  goToReservation() {
    const { product, selectedOptions } = this.data;
    
    if (product.stock <= 0) {
      wx.showToast({
        title: '商品已售罄',
        icon: 'none'
      });
      return;
    }

    // 检查必选项是否已选择
    if (product.options) {
      for (let option of product.options) {
        if (!selectedOptions[option.name]) {
          wx.showToast({
            title: `请选择${option.name}`,
            icon: 'none'
          });
          return;
        }
      }
    }

    // 保存选择的规格到全局数据
    app.globalData.selectedProduct = {
      ...product,
      selectedOptions
    };

    wx.navigateTo({
      url: `/pages/reservation/reservation?productId=${product.id}`
    });
  },

  // 跳转到其他产品
  goToProduct(e) {
    const productId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  },

  // 分享功能
  onShareAppMessage() {
    const { product } = this.data;
    return {
      title: `${product.name} - DIOR限量臻选`,
      path: `/pages/product-detail/product-detail?id=${product.id}`,
      imageUrl: product.images && product.images[0] || '/images/share-cover.jpg'
    };
  },

  onShareTimeline() {
    const { product } = this.data;
    return {
      title: `${product.name} - DIOR限量臻选`,
      imageUrl: product.images && product.images[0] || '/images/share-cover.jpg'
    };
  }
});