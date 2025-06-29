const app = getApp()

Page({
  data: {
    orderNumber: '',
    orderInfo: {},
    selectedDelivery: 'standard',
    selectedPayment: 'wechat',
    selectedCoupon: null,
    needInvoice: false,
    invoiceTypeIndex: 0,
    invoiceTypes: ['个人', '企业'],
    companyName: '',
    taxNumber: '',
    paying: false,
    finalPayAmount: 0,
    showCouponModal: false,
    deliveryOptions: [
      {
        id: 'standard',
        name: '标准配送',
        description: '3-5个工作日送达',
        fee: 0
      },
      {
        id: 'express',
        name: '极速配送',
        description: '24小时内送达',
        fee: 50
      },
      {
        id: 'appointment',
        name: '预约配送',
        description: '指定时间配送',
        fee: 30
      }
    ],
    paymentMethods: [
      {
        id: 'wechat',
        name: '微信支付',
        description: '推荐使用，安全便捷',
        icon: '/images/wechat-pay.png',
        isRecommended: true,
        discount: null
      },
      {
        id: 'balance',
        name: '钱包余额',
        description: '当前余额: ¥0.00',
        icon: '/images/wallet.png',
        isRecommended: false,
        discount: null
      }
    ],
    availableCoupons: [
      {
        id: 1,
        name: '新用户专享券',
        amount: 100,
        condition: '满1000元可用',
        expiry: '2024-12-31',
        minAmount: 1000
      },
      {
        id: 2,
        name: 'VIP专属折扣券',
        amount: 500,
        condition: '满5000元可用',
        expiry: '2024-12-31',
        minAmount: 5000
      }
    ]
  },

  onLoad(options) {
    const orderNumber = options.orderNumber;
    this.setData({ orderNumber });
    this.loadOrderInfo(orderNumber);
  },

  // 加载订单信息
  loadOrderInfo(orderNumber) {
    wx.showLoading({
      title: '加载中...'
    });

    // 从本地存储获取订单信息
    const orders = wx.getStorageSync('userOrders') || [];
    const order = orders.find(o => o.orderNumber === orderNumber);

    if (order) {
      // 处理规格文本
      let specsText = '';
      if (order.product.selectedOptions) {
        const specs = Object.keys(order.product.selectedOptions).map(key => {
          const optionMap = {
            'black': '经典黑',
            'red': '迪奥红',
            'beige': '象牙白',
            'small': '小号',
            'medium': '中号',
            'large': '大号'
          };
          return `${key}: ${optionMap[order.product.selectedOptions[key]] || order.product.selectedOptions[key]}`;
        });
        specsText = specs.join(', ');
      }

      const orderInfo = {
        ...order,
        specsText,
        deliveryFee: 0,
        finalAmount: order.totalAmount,
        createTime: this.formatTime(new Date(order.createTime))
      };

      this.setData({ orderInfo });
      this.calculateFinalAmount();
    } else {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      });
      wx.navigateBack();
    }

    wx.hideLoading();
  },

  // 配送方式改变
  onDeliveryChange(e) {
    const deliveryId = e.detail.value;
    this.setData({ selectedDelivery: deliveryId });
    this.calculateFinalAmount();
  },

  // 支付方式改变
  onPaymentChange(e) {
    const paymentId = e.detail.value;
    this.setData({ selectedPayment: paymentId });
  },

  // 发票开关
  onInvoiceToggle(e) {
    const needInvoice = e.detail.value;
    this.setData({ needInvoice });
  },

  // 发票类型改变
  onInvoiceTypeChange(e) {
    const index = e.detail.value;
    this.setData({ invoiceTypeIndex: index });
  },

  // 公司名称输入
  onCompanyNameInput(e) {
    this.setData({ companyName: e.detail.value });
  },

  // 税号输入
  onTaxNumberInput(e) {
    this.setData({ taxNumber: e.detail.value });
  },

  // 显示优惠券弹窗
  showCouponModal() {
    this.setData({ showCouponModal: true });
  },

  // 隐藏优惠券弹窗
  hideCouponModal() {
    this.setData({ showCouponModal: false });
  },

  // 选择优惠券
  selectCoupon(e) {
    const coupon = e.currentTarget.dataset.coupon;
    
    // 检查优惠券使用条件
    if (coupon && this.data.orderInfo.totalAmount < coupon.minAmount) {
      wx.showToast({
        title: `需满${coupon.minAmount}元才能使用`,
        icon: 'none'
      });
      return;
    }

    this.setData({ 
      selectedCoupon: coupon,
      showCouponModal: false 
    });
    this.calculateFinalAmount();
  },

  // 计算最终支付金额
  calculateFinalAmount() {
    const { orderInfo, selectedDelivery, selectedCoupon } = this.data;
    
    // 获取配送费
    const deliveryOption = this.data.deliveryOptions.find(o => o.id === selectedDelivery);
    const deliveryFee = deliveryOption ? deliveryOption.fee : 0;
    
    // 计算优惠券抵扣
    const couponDiscount = selectedCoupon ? selectedCoupon.amount : 0;
    
    // 计算最终金额
    const finalAmount = Math.max(0, orderInfo.totalAmount + deliveryFee - couponDiscount);
    
    this.setData({
      'orderInfo.deliveryFee': deliveryFee,
      'orderInfo.finalAmount': orderInfo.totalAmount + deliveryFee,
      finalPayAmount: finalAmount
    });
  },

  // 提交支付
  submitPayment() {
    const { selectedPayment, orderInfo, needInvoice } = this.data;
    
    // 验证发票信息
    if (needInvoice && this.data.invoiceTypeIndex === 1) {
      if (!this.data.companyName.trim() || !this.data.taxNumber.trim()) {
        wx.showToast({
          title: '请填写完整的发票信息',
          icon: 'none'
        });
        return;
      }
    }

    if (selectedPayment === 'wechat') {
      this.initiateWechatPay();
    } else if (selectedPayment === 'balance') {
      this.payWithBalance();
    }
  },

  // 发起微信支付
  initiateWechatPay() {
    this.setData({ paying: true });

    // 模拟调用后端API获取支付参数
    setTimeout(() => {
      this.processWechatPayment();
    }, 1000);
  },

  // 处理微信支付
  processWechatPayment() {
    const paymentParams = {
      timeStamp: Date.now().toString(),
      nonceStr: this.generateNonceStr(),
      package: `prepay_id=wx${Date.now()}`,
      signType: 'MD5',
      paySign: this.generatePaySign()
    };

    wx.requestPayment({
      ...paymentParams,
      success: (res) => {
        this.handlePaymentSuccess();
      },
      fail: (res) => {
        this.handlePaymentFail(res);
      },
      complete: () => {
        this.setData({ paying: false });
      }
    });
  },

  // 余额支付
  payWithBalance() {
    wx.showModal({
      title: '余额不足',
      content: '当前余额不足，请选择其他支付方式',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#D4AF37'
    });
  },

  // 支付成功处理
  handlePaymentSuccess() {
    // 更新订单状态
    this.updateOrderStatus('paid');

    wx.showToast({
      title: '支付成功！',
      icon: 'success',
      duration: 2000
    });

    // 跳转到成功页面
    setTimeout(() => {
      wx.redirectTo({
        url: `/pages/profile/profile?tab=orders`
      });
    }, 2000);
  },

  // 支付失败处理
  handlePaymentFail(error) {
    console.error('支付失败:', error);
    
    if (error.errMsg && error.errMsg.includes('cancel')) {
      wx.showToast({
        title: '支付已取消',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '支付失败，请重试',
        icon: 'none'
      });
    }
  },

  // 更新订单状态
  updateOrderStatus(status) {
    const orders = wx.getStorageSync('userOrders') || [];
    const index = orders.findIndex(o => o.orderNumber === this.data.orderNumber);
    
    if (index !== -1) {
      orders[index].status = status;
      orders[index].paymentTime = new Date().toISOString();
      
      // 添加支付信息
      orders[index].paymentInfo = {
        method: this.data.selectedPayment,
        amount: this.data.finalPayAmount,
        coupon: this.data.selectedCoupon,
        delivery: this.data.selectedDelivery,
        invoice: this.data.needInvoice ? {
          type: this.data.invoiceTypes[this.data.invoiceTypeIndex],
          companyName: this.data.companyName,
          taxNumber: this.data.taxNumber
        } : null
      };
      
      wx.setStorageSync('userOrders', orders);
    }
  },

  // 生成随机字符串
  generateNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  },

  // 生成支付签名（模拟）
  generatePaySign() {
    return Math.random().toString(36).substr(2, 32);
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'DIOR限量支付 - 奢华体验',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  }
});