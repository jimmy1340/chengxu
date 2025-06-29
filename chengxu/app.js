// app.js
App({
  globalData: {
    userInfo: null,
    isVIP: false,
    cartItems: [],
    currentProduct: null
  },

  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'dior-luxury-env', // 请替换为您的云开发环境ID
        traceUser: true
      });
    }

    // 获取用户信息
    this.getUserInfo();
    
    // 检查更新
    this.checkForUpdate();
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },

  getUserInfo() {
    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              that.globalData.userInfo = res.userInfo;
              // 检查VIP状态
              that.checkVIPStatus(res.userInfo);
            }
          });
        }
      }
    });
  },

  checkVIPStatus(userInfo) {
    // 模拟VIP检查逻辑
    const db = wx.cloud.database();
    db.collection('vip_users')
      .where({
        openid: userInfo.openId
      })
      .get()
      .then(res => {
        this.globalData.isVIP = res.data.length > 0;
      })
      .catch(err => {
        console.error('VIP状态检查失败:', err);
      });
  },

  checkForUpdate() {
    const updateManager = wx.getUpdateManager();
    
    updateManager.onCheckForUpdate(function(res) {
      console.log('检查更新:', res.hasUpdate);
    });

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function() {
      console.log('更新失败');
    });
  },

  // 全局方法：添加到购物车
  addToCart(product) {
    this.globalData.cartItems.push(product);
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success'
    });
  },

  // 全局方法：获取购物车商品数量
  getCartCount() {
    return this.globalData.cartItems.length;
  }
});