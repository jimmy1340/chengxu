// 注册页面交互脚本

// DOM元素
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const phoneInput = document.querySelector('.phone-input');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const captchaInput = document.querySelector('.captcha-input');
const agreementCheckbox = document.getElementById('agreement');

// 验证码相关
let currentCaptcha = '';

// 生成随机验证码
function generateCaptcha() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 刷新验证码
function refreshCaptcha() {
    currentCaptcha = generateCaptcha();
    const captchaImage = document.getElementById('captchaImage');
    captchaImage.textContent = currentCaptcha;
    
    // 添加刷新动画
    captchaImage.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
        captchaImage.style.transform = 'rotateY(0deg)';
    }, 300);
}

// 密码显示/隐藏切换
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// 验证用户名
function validateUsername(username) {
    if (username.length < 3) {
        return '用户名至少需要3个字符';
    }
    if (username.length > 20) {
        return '用户名不能超过20个字符';
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
        return '用户名只能包含字母、数字、下划线和中文';
    }
    return null;
}

// 验证手机号
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return '请输入正确的手机号格式';
    }
    return null;
}

// 验证邮箱
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '请输入正确的邮箱格式';
    }
    return null;
}

// 验证密码强度
function validatePassword(password) {
    if (password.length < 6) {
        return '密码至少需要6位字符';
    }
    if (password.length > 30) {
        return '密码不能超过30位字符';
    }
    
    let strength = 0;
    const checks = [
        /[a-z]/.test(password), // 小写字母
        /[A-Z]/.test(password), // 大写字母
        /\d/.test(password),    // 数字
        /[!@#$%^&*(),.?":{}|<>]/.test(password) // 特殊字符
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength < 2) {
        return '密码强度太弱，建议包含字母、数字或特殊字符';
    }
    
    return null;
}

// 验证确认密码
function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword !== password) {
        return '两次输入的密码不一致';
    }
    return null;
}

// 验证验证码
function validateCaptcha(captcha) {
    if (captcha.toLowerCase() !== currentCaptcha.toLowerCase()) {
        return '验证码错误';
    }
    return null;
}

// 显示错误信息
function showError(element, message) {
    clearError(element);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    element.style.borderColor = '#ff4757';
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

// 显示成功信息
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-animation';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

// 实时验证
usernameInput.addEventListener('blur', () => {
    const error = validateUsername(usernameInput.value.trim());
    if (error) {
        showError(usernameInput, error);
    } else {
        clearError(usernameInput);
    }
});

phoneInput.addEventListener('blur', () => {
    const error = validatePhone(phoneInput.value.trim());
    if (error) {
        showError(phoneInput.parentNode, error);
    } else {
        clearError(phoneInput.parentNode);
    }
});

emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value.trim());
    if (error) {
        showError(emailInput, error);
    } else {
        clearError(emailInput);
    }
});

passwordInput.addEventListener('blur', () => {
    const error = validatePassword(passwordInput.value);
    if (error) {
        showError(passwordInput, error);
    } else {
        clearError(passwordInput);
    }
});

confirmPasswordInput.addEventListener('blur', () => {
    const error = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
    if (error) {
        showError(confirmPasswordInput, error);
    } else {
        clearError(confirmPasswordInput);
    }
});

captchaInput.addEventListener('blur', () => {
    const error = validateCaptcha(captchaInput.value.trim());
    if (error) {
        showError(captchaInput, error);
    } else {
        clearError(captchaInput);
    }
});

// 输入框获得焦点时清除错误
[usernameInput, phoneInput, emailInput, passwordInput, confirmPasswordInput, captchaInput].forEach(input => {
    input.addEventListener('focus', () => {
        if (input === phoneInput) {
            clearError(input.parentNode);
        } else {
            clearError(input);
        }
    });
});

// 表单提交处理
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = {
        username: usernameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        captcha: captchaInput.value.trim(),
        agreement: agreementCheckbox.checked
    };
    
    let isValid = true;
    
    // 验证所有字段
    const validations = [
        { field: usernameInput, validator: () => validateUsername(formData.username) },
        { field: phoneInput.parentNode, validator: () => validatePhone(formData.phone) },
        { field: emailInput, validator: () => validateEmail(formData.email) },
        { field: passwordInput, validator: () => validatePassword(formData.password) },
        { field: confirmPasswordInput, validator: () => validateConfirmPassword(formData.password, formData.confirmPassword) },
        { field: captchaInput, validator: () => validateCaptcha(formData.captcha) }
    ];
    
    validations.forEach(({ field, validator }) => {
        const error = validator();
        if (error) {
            showError(field, error);
            isValid = false;
        } else {
            clearError(field);
        }
    });
    
    // 验证协议同意
    if (!formData.agreement) {
        alert('请阅读并同意《用户协议》和《隐私政策》');
        isValid = false;
    }
    
    // 如果验证通过，提交注册
    if (isValid) {
        await submitRegistration(formData);
    }
});

// 模拟注册提交
async function submitRegistration(formData) {
    const registerBtn = document.querySelector('.register-btn');
    const originalText = registerBtn.textContent;
    
    // 显示加载状态
    registerBtn.textContent = '注册中...';
    registerBtn.disabled = true;
    
    try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 模拟注册成功
        showSuccess('🎉 注册成功！即将跳转到登录页面...');
        
        // 重置表单
        registerForm.reset();
        refreshCaptcha();
        
        // 3秒后跳转到登录页面
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
        console.log('注册信息:', {
            username: formData.username,
            phone: formData.phone,
            email: formData.email,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        alert('注册失败，请稍后重试');
        console.error('注册错误:', error);
    } finally {
        // 重置按钮状态
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    }
}

// 第三方注册按钮
document.querySelector('.wechat-btn').addEventListener('click', () => {
    alert('微信注册功能开发中...');
});

document.querySelector('.qq-btn').addEventListener('click', () => {
    alert('QQ注册功能开发中...');
});

// 协议链接
document.querySelectorAll('.checkbox-label .link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkText = link.textContent;
        if (linkText.includes('用户协议')) {
            alert('用户协议页面开发中...');
        } else if (linkText.includes('隐私政策')) {
            alert('隐私政策页面开发中...');
        }
    });
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 快速提交
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        registerForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
    
    // ESC 键清除所有错误信息
    if (e.key === 'Escape') {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.form-input, .phone-input-group, .captcha-input').forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }
});

// 页面加载完成初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('注册页面加载完成');
    
    // 生成初始验证码
    refreshCaptcha();
    
    // 设置焦点到第一个输入框
    usernameInput.focus();
    
    // 添加密码强度指示器
    addPasswordStrengthIndicator();
});

// 添加密码强度指示器
function addPasswordStrengthIndicator() {
    const passwordGroup = passwordInput.parentNode;
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text">密码强度</div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .password-strength {
            margin-top: 5px;
            font-size: 12px;
        }
        .strength-bar {
            width: 100%;
            height: 4px;
            background: #eee;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 3px;
        }
        .strength-fill {
            height: 100%;
            width: 0%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        .strength-text {
            color: #999;
            text-align: left;
        }
    `;
    document.head.appendChild(style);
    
    passwordGroup.appendChild(strengthIndicator);
    
    // 密码强度检测
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strengthFill = strengthIndicator.querySelector('.strength-fill');
        const strengthText = strengthIndicator.querySelector('.strength-text');
        
        if (password.length === 0) {
            strengthFill.style.width = '0%';
            strengthText.textContent = '密码强度';
            strengthText.style.color = '#999';
            return;
        }
        
        let strength = 0;
        const checks = [
            password.length >= 6,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password),
            password.length >= 10
        ];
        
        strength = checks.filter(Boolean).length;
        
        const strengthLevels = [
            { width: '20%', color: '#ff4757', text: '很弱' },
            { width: '40%', color: '#ff6348', text: '弱' },
            { width: '60%', color: '#ffa726', text: '一般' },
            { width: '80%', color: '#26de81', text: '强' },
            { width: '100%', color: '#4CAF50', text: '很强' },
            { width: '100%', color: '#2e7d32', text: '极强' }
        ];
        
        const level = Math.min(strength, strengthLevels.length - 1);
        const currentLevel = strengthLevels[level];
        
        strengthFill.style.width = currentLevel.width;
        strengthFill.style.background = currentLevel.color;
        strengthText.textContent = `密码强度: ${currentLevel.text}`;
        strengthText.style.color = currentLevel.color;
    });
}