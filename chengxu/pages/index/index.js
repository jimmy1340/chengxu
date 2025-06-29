const app = getApp()

Page({
  data: {
    isVIP: false,
    showFloatingBtn: true,
    banners: [
      {
        id: 1,
        title: 'DIOR 2024',
        subtitle: '限量典藏系列',
        image: '/images/banner1.jpg'
      },
      {
        id: 2,
        title: 'Lady Dior',
        subtitle: '传奇手袋新作',
        image: '/images/banner2.jpg'
      },
      {
        id: 3,
        title: 'J\'adore',
        subtitle: '香氛臻品',
        image: '/images/banner3.jpg'
      }
    ],
    limitedProducts: [
      {
        id: 1,
        name: 'Lady Dior 限量手袋',
        description: '经典格纹设计，意大利手工制作',
        price: '35000',
        stock: 8,
        image: '/images/product1.jpg'
      },
      {
        id: 2,
        name: 'J\'adore 香水礼盒',
        description: '50ml香水+旅行装套装',
        price: '1580',
        stock: 25,
        image: '/images/product2.jpg'
      },
      {
        id: 3,
        name: 'Dior 珠宝系列',
        description: '18K金镶钻项链',
        price: '128000',
        stock: 3,
        image: '/images/product3.jpg'
      }
    ],
    exclusiveProducts: [
      {
        id: 101,
        name: 'VIP专属定制包',
        price: '50000',
        image: '/images/vip-product1.jpg'
      },
      {
        id: 102,
        name: '限量版丝巾',
        price: '3800',
        image: '/images/vip-product2.jpg'
      }
    ],
    features: [
      {
        id: 1,
        title: '正品保证',
        description: '100%正品，假一赔十',
        icon: '/images/authentic-icon.png'
      },
      {
        id: 2,
        title: '专属服务',
        description: '一对一VIP顾问',
        icon: '/images/service-icon.png'
      },
      {
        id: 3,
        title: '极速配送',
        description: '24小时内发货',
        icon: '/images/shipping-icon.png'
      },
      {
        id: 4,
        title: '无忧退换',
        description: '30天无理由退换',
        icon: '/images/return-icon.png'
      }
    ]
  },

  onLoad(options) {
    this.checkVIPStatus();
    this.loadUserData();
  },

  onShow() {
    // 页面显示时刷新VIP状态
    this.checkVIPStatus();
  },

  onPageScroll(e) {
    // 根据滚动位置控制浮动按钮显示
    const scrollTop = e.scrollTop;
    this.setData({
      showFloatingBtn: scrollTop > 300
    });
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.loadUserData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 检查VIP状态
  checkVIPStatus() {
    const isVIP = app.globalData.isVIP;
    this.setData({ isVIP });
  },

  // 加载用户数据
  loadUserData() {
    // 模拟加载数据
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
    }, 800);
  },

  // 跳转到产品详情
  goToProductDetail(e) {
    const product = e.currentTarget.dataset.product;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`,
      success() {
        // 保存当前产品信息到全局数据
        app.globalData.currentProduct = product;
      }
    });
  },

  // 快速预订
  quickReserve(e) {
    const product = e.currentTarget.dataset.product;
    
    if (product.stock <= 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认预订',
      content: `是否立即预订 ${product.name}？`,
      confirmText: '立即预订',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          this.reserveProduct(product);
        }
      }
    });
  },

  // 预订产品
  reserveProduct(product) {
    wx.showLoading({
      title: '预订中...'
    });

    // 模拟预订API调用
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新库存
      const products = this.data.limitedProducts;
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products[index].stock -= 1;
        this.setData({
          limitedProducts: products
        });
      }

      wx.showToast({
        title: '预订成功！',
        icon: 'success'
      });

      // 跳转到预订页面
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/reservation/reservation?productId=${product.id}`
        });
      }, 1500);
    }, 1000);
  },

  // 跳转到预订页面
  goToReservation() {
    wx.navigateTo({
      url: '/pages/reservation/reservation'
    });
  },

  // 跳转到产品列表
  goToProducts() {
    wx.navigateTo({
      url: '/pages/product-detail/product-detail'
    });
  },

  // 申请VIP
  applyVIP() {
    wx.showModal({
      title: 'VIP申请',
      content: '成为VIP会员需要验证身份信息，是否继续？',
      confirmText: '继续申请',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/profile/profile?action=vip'
          });
        }
      }
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'DIOR 限量臻选 - 奢华典藏',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: 'DIOR 限量臻选 - 奢华典藏',
      imageUrl: '/images/share-cover.jpg'
    };
  }
});