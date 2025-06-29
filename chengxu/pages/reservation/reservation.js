const app = getApp()

Page({
  data: {
    currentStep: 1,
    productId: null,
    selectedProduct: {},
    selectedOptionsArray: [],
    quantity: 1,
    formData: {
      name: '',
      phone: '',
      idCard: '',
      address: ''
    },
    isFormValid: false,
    isVIP: false,
    agreedToTerms: false,
    totalAmount: 0,
    submitting: false,
    orderNumber: '',
    showCountdown: false,
    countdownText: '',
    countdownTimer: null
  },

  onLoad(options) {
    const productId = options.productId;
    this.setData({ productId });
    
    this.loadProductInfo();
    this.checkVIPStatus();
    this.loadUserProfile();
  },

  onUnload() {
    // 清理倒计时
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer);
    }
  },

  // 加载产品信息
  loadProductInfo() {
    const selectedProduct = app.globalData.selectedProduct || {
      id: this.data.productId,
      name: 'Lady Dior 限量手袋',
      price: '35000',
      stock: 8,
      image: '/images/product1.jpg',
      selectedOptions: {
        '颜色': 'black',
        '尺寸': 'medium'
      }
    };

    // 转换选择的选项为数组格式用于显示
    const selectedOptionsArray = [];
    if (selectedProduct.selectedOptions) {
      Object.keys(selectedProduct.selectedOptions).forEach(key => {
        const optionMap = {
          'black': '经典黑',
          'red': '迪奥红',
          'beige': '象牙白',
          'small': '小号',
          'medium': '中号',
          'large': '大号'
        };
        selectedOptionsArray.push({
          name: key,
          value: optionMap[selectedProduct.selectedOptions[key]] || selectedProduct.selectedOptions[key]
        });
      });
    }

    this.setData({
      selectedProduct,
      selectedOptionsArray
    });

    this.calculateTotal();
  },

  // 检查VIP状态
  checkVIPStatus() {
    const isVIP = app.globalData.isVIP;
    this.setData({ isVIP });
  },

  // 加载用户资料
  loadUserProfile() {
    // 尝试从缓存加载用户信息
    const savedProfile = wx.getStorageSync('userProfile');
    if (savedProfile) {
      this.setData({
        formData: {
          ...this.data.formData,
          ...savedProfile
        }
      });
      this.validateForm();
    }
  },

  // 增加数量
  increaseQuantity() {
    const { quantity, selectedProduct } = this.data;
    if (quantity < selectedProduct.stock) {
      this.setData({
        quantity: quantity + 1
      });
      this.calculateTotal();
    }
  },

  // 减少数量
  decreaseQuantity() {
    const { quantity } = this.data;
    if (quantity > 1) {
      this.setData({
        quantity: quantity - 1
      });
      this.calculateTotal();
    }
  },

  // 计算总金额
  calculateTotal() {
    const { selectedProduct, quantity } = this.data;
    const totalAmount = parseInt(selectedProduct.price) * quantity;
    this.setData({ totalAmount });
  },

  // 下一步
  nextStep() {
    const { currentStep } = this.data;
    
    if (currentStep === 1) {
      // 验证库存
      if (this.data.selectedProduct.stock < this.data.quantity) {
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        });
        return;
      }
    } else if (currentStep === 2) {
      // 验证表单
      if (!this.data.isFormValid) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
      
      // 保存用户信息到缓存
      wx.setStorageSync('userProfile', this.data.formData);
      
      // 启动倒计时
      this.startCountdown();
    }

    if (currentStep < 3) {
      this.setData({
        currentStep: currentStep + 1
      });
    }
  },

  // 上一步
  prevStep() {
    const { currentStep } = this.data;
    if (currentStep > 1) {
      this.setData({
        currentStep: currentStep - 1
      });
      
      // 停止倒计时
      if (this.data.countdownTimer) {
        clearInterval(this.data.countdownTimer);
        this.setData({
          showCountdown: false,
          countdownTimer: null
        });
      }
    }
  },

  // 表单输入处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`formData.${field}`]: value
    });
    
    this.validateForm();
  },

  // 验证表单
  validateForm() {
    const { formData } = this.data;
    const phoneRegex = /^1[3-9]\d{9}$/;
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    
    const isValid = formData.name.trim() !== '' &&
                   phoneRegex.test(formData.phone) &&
                   idCardRegex.test(formData.idCard) &&
                   formData.address.trim() !== '';
    
    this.setData({ isFormValid: isValid });
  },

  // 申请VIP
  applyVIP() {
    wx.navigateTo({
      url: '/pages/profile/profile?action=vip'
    });
  },

  // 协议同意状态改变
  onAgreementChange(e) {
    const agreed = e.detail.value.includes('agree');
    this.setData({ agreedToTerms: agreed });
  },

  // 显示条款
  showTerms() {
    wx.showModal({
      title: '预订协议',
      content: '1. 预订商品仅为您保留48小时\n2. 请在保留期内完成支付\n3. 限量商品不支持退换\n4. 所有商品均为正品保证\n5. 如有争议以实际情况为准',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 启动倒计时
  startCountdown() {
    const countdownDuration = 30 * 60; // 30分钟
    let remainingTime = countdownDuration;
    
    this.setData({ showCountdown: true });
    
    const timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(timer);
        this.handleTimeout();
        return;
      }
      
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const countdownText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({ countdownText });
      remainingTime--;
    }, 1000);
    
    this.setData({ countdownTimer: timer });
  },

  // 处理超时
  handleTimeout() {
    wx.showModal({
      title: '预订超时',
      content: '预订时间已超时，请重新预订',
      showCancel: false,
      confirmText: '重新预订',
      confirmColor: '#D4AF37',
      success: () => {
        wx.navigateBack();
      }
    });
  },

  // 确认预订
  confirmReservation() {
    if (!this.data.agreedToTerms) {
      wx.showToast({
        title: '请同意预订协议',
        icon: 'none'
      });
      return;
    }

    this.setData({ submitting: true });

    // 模拟API调用
    setTimeout(() => {
      this.processReservation();
    }, 2000);
  },

  // 处理预订
  processReservation() {
    const orderNumber = 'DR' + Date.now().toString().substr(-8);
    
    // 模拟库存扣减
    const product = this.data.selectedProduct;
    product.stock -= this.data.quantity;
    
    // 保存订单信息
    const orderInfo = {
      orderNumber,
      product: this.data.selectedProduct,
      quantity: this.data.quantity,
      totalAmount: this.data.totalAmount,
      userInfo: this.data.formData,
      status: 'pending',
      createTime: new Date().toISOString()
    };
    
    // 保存到本地存储（实际项目中应调用API）
    let orders = wx.getStorageSync('userOrders') || [];
    orders.unshift(orderInfo);
    wx.setStorageSync('userOrders', orders);

    this.setData({
      submitting: false,
      currentStep: 4,
      orderNumber
    });

    // 清理倒计时
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer);
    }

    // 显示成功提示
    wx.showToast({
      title: '预订成功！',
      icon: 'success',
      duration: 2000
    });
  },

  // 跳转到个人中心
  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  // 跳转到支付页面
  goToPayment() {
    wx.navigateTo({
      url: `/pages/payment/payment?orderNumber=${this.data.orderNumber}`
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'DIOR限量预订 - 奢华体验',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  }
});