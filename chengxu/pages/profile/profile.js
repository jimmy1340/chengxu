const app = getApp()

Page({
  data: {
    userInfo: null,
    isVIP: false,
    currentTab: 'all',
    userOrders: [],
    displayOrders: [],
    favoriteProducts: [],
    appVersion: '1.0.0',
    orderStatusMap: {
      'pending': '待支付',
      'paid': '已支付',
      'shipped': '已发货',
      'delivered': '已完成',
      'cancelled': '已取消'
    },
    vipPrivileges: [
      {
        title: '专属折扣',
        icon: '/images/privilege-discount.png'
      },
      {
        title: '优先购买',
        icon: '/images/privilege-priority.png'
      },
      {
        title: '专属客服',
        icon: '/images/privilege-service.png'
      },
      {
        title: '生日特惠',
        icon: '/images/privilege-birthday.png'
      }
    ],
    serviceItems: [
      {
        title: '在线客服',
        icon: '/images/service-chat.png',
        action: 'contactService'
      },
      {
        title: '配送查询',
        icon: '/images/service-delivery.png',
        action: 'trackDelivery'
      },
      {
        title: '退换货',
        icon: '/images/service-return.png',
        action: 'returnPolicy'
      },
      {
        title: '发票申请',
        icon: '/images/service-invoice.png',
        action: 'applyInvoice'
      },
      {
        title: '意见反馈',
        icon: '/images/service-feedback.png',
        action: 'submitFeedback'
      },
      {
        title: '帮助中心',
        icon: '/images/service-help.png',
        action: 'helpCenter'
      }
    ],
    settingItems: [
      {
        title: '消息推送',
        icon: '/images/setting-notification.png',
        type: 'switch',
        key: 'notification',
        checked: true,
        action: 'toggleNotification'
      },
      {
        title: '收货地址',
        icon: '/images/setting-address.png',
        action: 'manageAddress'
      },
      {
        title: '支付设置',
        icon: '/images/setting-payment.png',
        action: 'paymentSetting'
      },
      {
        title: '隐私设置',
        icon: '/images/setting-privacy.png',
        action: 'privacySetting'
      },
      {
        title: '清除缓存',
        icon: '/images/setting-cache.png',
        action: 'clearCache'
      }
    ]
  },

  onLoad(options) {
    this.checkLoginStatus();
    this.loadUserOrders();
    this.loadFavoriteProducts();
    
    // 处理来自其他页面的参数
    if (options.tab) {
      this.setData({ currentTab: options.tab });
    }
    
    if (options.action === 'vip') {
      this.applyVIP();
    }
  },

  onShow() {
    this.checkLoginStatus();
    this.checkVIPStatus();
    this.loadUserOrders();
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });
  },

  // 检查VIP状态
  checkVIPStatus() {
    const isVIP = app.globalData.isVIP;
    this.setData({ isVIP });
  },

  // 获取用户信息
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      app.globalData.userInfo = userInfo;
      this.setData({ userInfo });
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  },

  // 编辑个人资料
  editProfile() {
    wx.showModal({
      title: '编辑资料',
      content: '此功能正在开发中，敬请期待',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 申请VIP
  applyVIP() {
    wx.showModal({
      title: 'VIP申请',
      content: '成为VIP会员需要满足一定条件，是否提交申请？',
      confirmText: '提交申请',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          this.processVIPApplication();
        }
      }
    });
  },

  // 处理VIP申请
  processVIPApplication() {
    wx.showLoading({
      title: '处理中...'
    });

    // 模拟申请处理
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟申请成功
      app.globalData.isVIP = true;
      this.setData({ isVIP: true });
      
      wx.showModal({
        title: '申请成功',
        content: '恭喜您成为VIP会员！您将享受专属特权和优质服务。',
        showCancel: false,
        confirmText: '太好了',
        confirmColor: '#D4AF37'
      });
    }, 2000);
  },

  // 加载用户订单
  loadUserOrders() {
    const orders = wx.getStorageSync('userOrders') || [];
    this.setData({ 
      userOrders: orders 
    });
    this.filterOrders();
  },

  // 切换订单标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.filterOrders();
  },

  // 过滤订单
  filterOrders() {
    const { userOrders, currentTab } = this.data;
    let displayOrders = userOrders;
    
    if (currentTab !== 'all') {
      displayOrders = userOrders.filter(order => order.status === currentTab);
    }
    
    this.setData({ displayOrders });
  },

  // 查看所有订单
  viewAllOrders() {
    wx.showModal({
      title: '订单管理',
      content: '完整的订单管理功能正在开发中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: `订单 ${order.orderNumber}`,
      content: `商品：${order.product.name}\n数量：${order.quantity}\n金额：¥${order.totalAmount}\n状态：${this.data.orderStatusMap[order.status]}`,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 支付订单
  payOrder(e) {
    const order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: `/pages/payment/payment?orderNumber=${order.orderNumber}`
    });
  },

  // 取消订单
  cancelOrder(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '申请退款',
      content: '确定要申请退款吗？',
      confirmText: '确定',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          this.processCancelOrder(order);
        }
      }
    });
  },

  // 处理取消订单
  processCancelOrder(order) {
    // 更新订单状态
    const orders = wx.getStorageSync('userOrders') || [];
    const index = orders.findIndex(o => o.orderNumber === order.orderNumber);
    
    if (index !== -1) {
      orders[index].status = 'cancelled';
      wx.setStorageSync('userOrders', orders);
      this.loadUserOrders();
      
      wx.showToast({
        title: '退款申请已提交',
        icon: 'success'
      });
    }
  },

  // 加载收藏商品
  loadFavoriteProducts() {
    // 模拟从收藏列表加载
    const mockFavorites = [
      {
        id: 1,
        name: 'Lady Dior',
        price: '35000',
        image: '/images/product1.jpg'
      },
      {
        id: 2,
        name: 'J\'adore香水',
        price: '1580',
        image: '/images/product2.jpg'
      }
    ];
    
    this.setData({ favoriteProducts: mockFavorites });
  },

  // 查看所有收藏
  viewAllFavorites() {
    wx.showModal({
      title: '我的收藏',
      content: '完整的收藏管理功能正在开发中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 跳转到产品页面
  goToProduct(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  },

  // 处理服务点击
  handleServiceClick(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'contactService':
        this.contactService();
        break;
      case 'trackDelivery':
        this.trackDelivery();
        break;
      case 'returnPolicy':
        this.showReturnPolicy();
        break;
      case 'applyInvoice':
        this.applyInvoice();
        break;
      case 'submitFeedback':
        this.submitFeedback();
        break;
      case 'helpCenter':
        this.openHelpCenter();
        break;
      default:
        this.showComingSoon();
    }
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服热线：400-820-8788\n服务时间：09:00-21:00\n\n是否拨打客服电话？',
      confirmText: '拨打电话',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-820-8788'
          });
        }
      }
    });
  },

  // 配送查询
  trackDelivery() {
    wx.showModal({
      title: '配送查询',
      content: '请提供订单号进行配送查询',
      placeholderText: '请输入订单号',
      editable: true,
      confirmText: '查询',
      confirmColor: '#D4AF37'
    });
  },

  // 显示退换货政策
  showReturnPolicy() {
    wx.showModal({
      title: '退换货政策',
      content: '• 商品自购买之日起30天内可申请退换\n• 商品必须保持原包装和标签完整\n• 个人定制商品不支持退换\n• 退换货需承担相应运费',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 申请发票
  applyInvoice() {
    wx.showModal({
      title: '发票申请',
      content: '发票申请功能正在开发中，如需发票请联系客服',
      showCancel: false,
      confirmText: '联系客服',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          this.contactService();
        }
      }
    });
  },

  // 意见反馈
  submitFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    }).catch(() => {
      wx.showModal({
        title: '意见反馈',
        content: '反馈页面正在开发中，请通过客服提交意见',
        showCancel: false,
        confirmText: '联系客服',
        confirmColor: '#D4AF37',
        success: (res) => {
          if (res.confirm) {
            this.contactService();
          }
        }
      });
    });
  },

  // 帮助中心
  openHelpCenter() {
    wx.showModal({
      title: '帮助中心',
      content: '常见问题：\n1. 如何成为VIP会员？\n2. 如何查询订单状态？\n3. 如何申请退换货？\n4. 如何联系客服？\n\n更多帮助请联系客服',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 处理设置点击
  handleSettingClick(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'manageAddress':
        this.manageAddress();
        break;
      case 'paymentSetting':
        this.paymentSetting();
        break;
      case 'privacySetting':
        this.privacySetting();
        break;
      case 'clearCache':
        this.clearCache();
        break;
      default:
        this.showComingSoon();
    }
  },

  // 设置开关切换
  onSettingToggle(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    
    const settingItems = this.data.settingItems.map(item => {
      if (item.key === key) {
        item.checked = value;
      }
      return item;
    });
    
    this.setData({ settingItems });
    
    // 保存设置到本地
    wx.setStorageSync(`setting_${key}`, value);
    
    wx.showToast({
      title: value ? '已开启' : '已关闭',
      icon: 'success'
    });
  },

  // 管理地址
  manageAddress() {
    wx.showModal({
      title: '收货地址',
      content: '地址管理功能正在开发中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 支付设置
  paymentSetting() {
    wx.showModal({
      title: '支付设置',
      content: '支付设置功能正在开发中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 隐私设置
  privacySetting() {
    wx.showModal({
      title: '隐私设置',
      content: '隐私设置功能正在开发中',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除缓存吗？这将清除临时文件和图片缓存。',
      confirmText: '确定',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中...'
          });
          
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  },

  // 显示功能开发中
  showComingSoon() {
    wx.showModal({
      title: '功能开发中',
      content: '该功能正在开发中，敬请期待',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'DIOR限量臻选 - 我的专属奢华空间',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  }
});