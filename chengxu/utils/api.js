const BASE_URL = 'https://api.dior-luxury.com' // 请替换为实际的API基础URL

/**
 * 网络请求封装
 * @param {Object} options 请求配置
 * @returns {Promise} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      timeout = 10000
    } = options

    // 添加默认请求头
    const defaultHeader = {
      'Content-Type': 'application/json',
      ...header
    }

    // 添加token
    const token = wx.getStorageSync('token')
    if (token) {
      defaultHeader['Authorization'] = `Bearer ${token}`
    }

    wx.showLoading({
      title: '请求中...',
      mask: true
    })

    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: defaultHeader,
      timeout,
      success: (res) => {
        wx.hideLoading()
        
        if (res.statusCode === 200) {
          const { code, data, message } = res.data
          
          if (code === 0) {
            resolve(data)
          } else {
            wx.showToast({
              title: message || '请求失败',
              icon: 'none'
            })
            reject(new Error(message || '请求失败'))
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(new Error('网络错误'))
        }
      },
      fail: (error) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

/**
 * GET请求
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const get = (url, params = {}, options = {}) => {
  const query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
  const fullUrl = query ? `${url}?${query}` : url
  
  return request({
    url: fullUrl,
    method: 'GET',
    ...options
  })
}

/**
 * POST请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const del = (url, params = {}, options = {}) => {
  const query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
  const fullUrl = query ? `${url}?${query}` : url
  
  return request({
    url: fullUrl,
    method: 'DELETE',
    ...options
  })
}

/**
 * 文件上传
 * @param {String} filePath 文件路径
 * @param {String} name 文件对应的key
 * @param {String} url 上传地址
 * @param {Object} formData 其他表单数据
 * @returns {Promise} 上传结果
 */
const uploadFile = (filePath, name = 'file', url = '/upload', formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const header = {}
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.showLoading({
      title: '上传中...',
      mask: true
    })

    wx.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header,
      success: (res) => {
        wx.hideLoading()
        
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0) {
              resolve(data.data)
            } else {
              wx.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              })
              reject(new Error(data.message || '上传失败'))
            }
          } catch (error) {
            wx.showToast({
              title: '数据解析失败',
              icon: 'none'
            })
            reject(error)
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject(new Error('上传失败'))
        }
      },
      fail: (error) => {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

// API接口定义
const API = {
  // 用户相关
  user: {
    login: (data) => post('/user/login', data),
    logout: () => post('/user/logout'),
    getUserInfo: () => get('/user/info'),
    updateUserInfo: (data) => put('/user/info', data),
    applyVIP: (data) => post('/user/vip/apply', data),
    getVIPStatus: () => get('/user/vip/status')
  },

  // 产品相关
  product: {
    getList: (params) => get('/products', params),
    getDetail: (id) => get(`/products/${id}`),
    getLimitedProducts: () => get('/products/limited'),
    search: (keyword) => get('/products/search', { keyword }),
    getRecommendations: (productId) => get(`/products/${productId}/recommendations`)
  },

  // 订单相关
  order: {
    create: (data) => post('/orders', data),
    getList: (params) => get('/orders', params),
    getDetail: (orderNumber) => get(`/orders/${orderNumber}`),
    cancel: (orderNumber) => put(`/orders/${orderNumber}/cancel`),
    pay: (orderNumber, data) => post(`/orders/${orderNumber}/pay`, data),
    getPaymentStatus: (orderNumber) => get(`/orders/${orderNumber}/payment-status`)
  },

  // 预订相关
  reservation: {
    create: (data) => post('/reservations', data),
    getList: (params) => get('/reservations', params),
    getDetail: (id) => get(`/reservations/${id}`),
    cancel: (id) => put(`/reservations/${id}/cancel`),
    updateStock: (productId, quantity) => put(`/products/${productId}/stock`, { quantity })
  },

  // 收藏相关
  favorite: {
    add: (productId) => post('/favorites', { productId }),
    remove: (productId) => del(`/favorites/${productId}`),
    getList: () => get('/favorites'),
    check: (productId) => get(`/favorites/check/${productId}`)
  },

  // 地址相关
  address: {
    getList: () => get('/addresses'),
    create: (data) => post('/addresses', data),
    update: (id, data) => put(`/addresses/${id}`, data),
    delete: (id) => del(`/addresses/${id}`),
    setDefault: (id) => put(`/addresses/${id}/default`)
  },

  // 优惠券相关
  coupon: {
    getList: () => get('/coupons'),
    getAvailable: (amount) => get('/coupons/available', { amount }),
    use: (couponId, orderNumber) => post('/coupons/use', { couponId, orderNumber })
  },

  // 支付相关
  payment: {
    createWeChatPay: (orderNumber) => post('/payment/wechat', { orderNumber }),
    getPaymentResult: (orderNumber) => get(`/payment/result/${orderNumber}`)
  },

  // 物流相关
  logistics: {
    track: (orderNumber) => get(`/logistics/track/${orderNumber}`),
    getDeliveryOptions: () => get('/logistics/delivery-options')
  },

  // 反馈相关
  feedback: {
    submit: (data) => post('/feedback', data),
    getList: () => get('/feedback')
  },

  // 系统相关
  system: {
    getConfig: () => get('/system/config'),
    checkUpdate: () => get('/system/update'),
    uploadImage: (filePath) => uploadFile(filePath, 'image', '/system/upload/image')
  }
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile,
  API
}