// DOM元素
const loginForm = document.getElementById('loginForm');
const tabs = document.querySelectorAll('.tab');
const phoneInput = document.querySelector('.phone-input');
const passwordInput = document.querySelector('.password-input');
const countryCode = document.querySelector('.country-code');

// 标签切换功能
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有活动状态
        tabs.forEach(t => t.classList.remove('active'));
        // 添加当前点击的标签为活动状态
        tab.classList.add('active');
        
        // 根据选择的标签更改输入框
        const isPhone = tab.textContent === '手机';
        const inputGroup = document.querySelector('.phone-input-group');
        const phoneInputElement = document.querySelector('.phone-input');
        
        if (isPhone) {
            phoneInputElement.type = 'tel';
            phoneInputElement.placeholder = '请输入手机号';
            countryCode.style.display = 'block';
        } else {
            phoneInputElement.type = 'email';
            phoneInputElement.placeholder = '请输入邮箱';
            countryCode.style.display = 'none';
        }
    });
});

// 手机号验证
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 邮箱验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 密码验证
function validatePassword(password) {
    return password.length >= 6;
}

// 显示错误信息
function showError(element, message) {
    // 移除之前的错误信息
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 创建新的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4757';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.textAlign = 'left';
    errorDiv.textContent = message;
    
    // 添加错误样式
    element.style.borderColor = '#ff4757';
    
    // 插入错误信息
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

// 清除错误信息
function clearError(element) {
    const errorMessage = element.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    element.style.borderColor = '#ddd';
}

// 输入框焦点事件 - 清除错误信息
phoneInput.addEventListener('focus', () => clearError(phoneInput.parentNode));
passwordInput.addEventListener('focus', () => clearError(passwordInput));

// 表单提交处理
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isPhoneTab = document.querySelector('.tab.active').textContent === '手机';
    const account = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    
    let isValid = true;
    
    // 验证账号（手机号或邮箱）
    if (!account) {
        showError(phoneInput.parentNode, isPhoneTab ? '请输入手机号' : '请输入邮箱');
        isValid = false;
    } else if (isPhoneTab && !validatePhone(account)) {
        showError(phoneInput.parentNode, '请输入正确的手机号格式');
        isValid = false;
    } else if (!isPhoneTab && !validateEmail(account)) {
        showError(phoneInput.parentNode, '请输入正确的邮箱格式');
        isValid = false;
    } else {
        clearError(phoneInput.parentNode);
    }
    
    // 验证密码
    if (!password) {
        showError(passwordInput, '请输入密码');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(passwordInput, '密码至少需要6位字符');
        isValid = false;
    } else {
        clearError(passwordInput);
    }
    
    // 如果验证通过，模拟登录
    if (isValid) {
        simulateLogin(account, password, isPhoneTab);
    }
});

// 模拟登录过程
function simulateLogin(account, password, isPhone) {
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    
    // 显示加载状态
    loginBtn.textContent = '登录中...';
    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.7';
    
    // 模拟网络请求延迟
    setTimeout(() => {
        // 重置按钮状态
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
        
        // 模拟登录结果
        const loginType = isPhone ? '手机号' : '邮箱';
        alert(`登录成功！\n${loginType}: ${account}\n欢迎使用上线了平台！`);
        
        // 实际项目中，这里应该跳转到主页面或仪表板
        console.log('登录信息:', {
            type: loginType,
            account: account,
            timestamp: new Date().toISOString()
        });
    }, 1500);
}

// 短信验证码登录
document.querySelector('.sms-login').addEventListener('click', (e) => {
    e.preventDefault();
    alert('短信验证码登录功能开发中...');
});

// 忘记密码
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    alert('找回密码功能开发中...');
});

// 第三方登录
document.querySelector('.wechat-login').addEventListener('click', () => {
    alert('第三方登录功能开发中...');
});

// 免费注册 - 直接跳转到注册页面
document.querySelector('.register-link a').addEventListener('click', (e) => {
    // 让链接正常跳转，不需要阻止默认行为
    console.log('正在跳转到注册页面...');
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('登录页面加载完成');
    
    // 设置焦点到第一个输入框
    phoneInput.focus();
});

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 快速提交
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
});