document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const typeBtns = document.querySelectorAll('.type-btn');
    const phoneInput = document.querySelector('.phone-input');
    const emailInput = document.querySelector('.email-input');
    const loginForm = document.querySelector('.login-form');
    const loginBtn = document.querySelector('.login-btn');
    
    // 手机/邮箱切换功能
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            typeBtns.forEach(b => b.classList.remove('active'));
            // 为当前按钮添加active类
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            
            if (type === 'phone') {
                phoneInput.style.display = 'flex';
                emailInput.style.display = 'none';
            } else {
                phoneInput.style.display = 'none';
                emailInput.style.display = 'block';
            }
        });
    });
    
    // 表单提交处理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const activeType = document.querySelector('.type-btn.active').getAttribute('data-type');
        const password = document.querySelector('.password-field').value;
        
        let username = '';
        if (activeType === 'phone') {
            const countryCode = document.querySelector('.country-code').value;
            const phone = document.querySelector('.phone-field').value;
            username = countryCode + phone;
        } else {
            username = document.querySelector('.email-field').value;
        }
        
        // 简单的表单验证
        if (!username.trim()) {
            alert(activeType === 'phone' ? '请输入手机号' : '请输入邮箱');
            return;
        }
        
        if (!password.trim()) {
            alert('请输入密码');
            return;
        }
        
        if (activeType === 'phone') {
            // 简单的手机号验证
            const phonePattern = /^1[3-9]\d{9}$/;
            const phoneNumber = document.querySelector('.phone-field').value;
            if (!phonePattern.test(phoneNumber)) {
                alert('请输入正确的手机号格式');
                return;
            }
        } else {
            // 简单的邮箱验证
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(username)) {
                alert('请输入正确的邮箱格式');
                return;
            }
        }
        
        // 模拟登录过程
        loginBtn.textContent = '登录中...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            alert(`登录成功！\n用户名: ${username}`);
            loginBtn.textContent = '登录';
            loginBtn.disabled = false;
            
            // 重置表单
            loginForm.reset();
        }, 2000);
    });
    
    // 短信验证码登录
    document.querySelector('.sms-login').addEventListener('click', function(e) {
        e.preventDefault();
        alert('短信验证码登录功能开发中...');
    });
    
    // 忘记密码
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('忘记密码功能开发中...');
    });
    
    // 第三方登录
    document.querySelector('.third-party-btn').addEventListener('click', function(e) {
        e.preventDefault();
        alert('第三方登录功能开发中...');
    });
    
    // 免费注册
    document.querySelector('.register-link a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('注册功能开发中...');
    });
    
    // 输入框焦点效果
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});