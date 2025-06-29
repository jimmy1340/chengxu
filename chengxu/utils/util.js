/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @param {String} format 格式字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {String} 格式化后的时间字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const formatNumber = n => n.toString().padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', formatNumber(month))
    .replace('DD', formatNumber(day))
    .replace('HH', formatNumber(hour))
    .replace('mm', formatNumber(minute))
    .replace('ss', formatNumber(second))
}

/**
 * 获取当前日期
 * @returns {String} 当前日期字符串
 */
const getCurrentDate = () => {
  return formatTime(new Date(), 'YYYY-MM-DD')
}

/**
 * 获取当前时间戳
 * @returns {Number} 当前时间戳
 */
const getCurrentTimestamp = () => {
  return Date.now()
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {Number} limit 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
const throttle = (func, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @returns {String} 随机字符串
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {Boolean} 是否有效
 */
const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证身份证号
 * @param {String} idCard 身份证号
 * @returns {Boolean} 是否有效
 */
const validateIdCard = (idCard) => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

/**
 * 验证邮箱
 * @param {String} email 邮箱地址
 * @returns {Boolean} 是否有效
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 格式化金额
 * @param {Number} amount 金额
 * @param {Number} decimals 小数位数，默认为2
 * @returns {String} 格式化后的金额字符串
 */
const formatMoney = (amount, decimals = 2) => {
  if (isNaN(amount) || amount === null) return '0.00'
  return Number(amount).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key])
    })
    return copy
  }
}

/**
 * 存储数据到本地
 * @param {String} key 存储键
 * @param {Any} data 要存储的数据
 * @returns {Boolean} 是否存储成功
 */
const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (error) {
    console.error('存储数据失败:', error)
    return false
  }
}

/**
 * 从本地获取数据
 * @param {String} key 存储键
 * @param {Any} defaultValue 默认值
 * @returns {Any} 获取到的数据
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const data = wx.getStorageSync(key)
    return data !== '' ? data : defaultValue
  } catch (error) {
    console.error('获取数据失败:', error)
    return defaultValue
  }
}

/**
 * 删除本地存储数据
 * @param {String} key 存储键
 * @returns {Boolean} 是否删除成功
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除数据失败:', error)
    return false
  }
}

/**
 * 显示loading
 * @param {String} title 提示文字
 * @param {Boolean} mask 是否显示透明蒙层
 */
const showLoading = (title = '加载中...', mask = true) => {
  wx.showLoading({
    title,
    mask
  })
}

/**
 * 隐藏loading
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示提示消息
 * @param {String} title 提示内容
 * @param {String} icon 图标类型
 * @param {Number} duration 显示时长
 */
const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示确认对话框
 * @param {String} title 标题
 * @param {String} content 内容
 * @param {Function} confirmCallback 确认回调
 * @param {Function} cancelCallback 取消回调
 */
const showConfirm = (title, content, confirmCallback, cancelCallback) => {
  wx.showModal({
    title,
    content,
    confirmColor: '#D4AF37',
    success: (res) => {
      if (res.confirm && confirmCallback) {
        confirmCallback()
      } else if (res.cancel && cancelCallback) {
        cancelCallback()
      }
    }
  })
}

/**
 * 页面跳转
 * @param {String} url 跳转路径
 * @param {String} type 跳转类型：navigate, redirect, switchTab, reLaunch
 * @param {Object} params 附加参数
 */
const navigateTo = (url, type = 'navigate', params = {}) => {
  const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
  const fullUrl = query ? `${url}?${query}` : url
  
  const navigationMap = {
    navigate: wx.navigateTo,
    redirect: wx.redirectTo,
    switchTab: wx.switchTab,
    reLaunch: wx.reLaunch
  }
  
  const navigateFunc = navigationMap[type] || wx.navigateTo
  navigateFunc({ url: fullUrl })
}

/**
 * 检查网络状态
 * @returns {Promise} 网络状态信息
 */
const checkNetworkStatus = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 获取系统信息
 * @returns {Promise} 系统信息
 */
const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

module.exports = {
  formatTime,
  getCurrentDate,
  getCurrentTimestamp,
  debounce,
  throttle,
  generateRandomString,
  validatePhone,
  validateIdCard,
  validateEmail,
  formatMoney,
  deepClone,
  setStorage,
  getStorage,
  removeStorage,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  navigateTo,
  checkNetworkStatus,
  getSystemInfo
}