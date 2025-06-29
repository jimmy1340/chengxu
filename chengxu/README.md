# 登录页面小程序

这是一个模仿"上线了"网站登录页面的小程序，具有现代化的UI设计和完整的交互功能。

## 功能特性

### 🎨 界面设计
- 紫色渐变背景，美观现代
- 响应式设计，支持手机和桌面端
- 圆角卡片布局，优雅的阴影效果
- 平滑的动画过渡效果

### 📱 登录方式
- **手机号登录**：支持+86等国家代码选择
- **邮箱登录**：标签切换到邮箱模式
- 国际化手机号格式支持

### ✅ 表单验证
- 实时输入验证
- 中国手机号格式验证（1开头，11位数字）
- 邮箱格式验证
- 密码长度验证（最少6位）
- 友好的错误提示信息

### 🔧 交互功能
- 手机/邮箱标签切换
- 输入框聚焦状态和动画
- 登录按钮加载状态
- 键盘快捷键支持（Ctrl/Cmd + Enter）

### 🔗 扩展功能
- 短信验证码登录（占位功能）
- 忘记密码（占位功能）
- 第三方账号登录（占位功能）
- **免费注册页面（完整功能）**

### 📝 注册页面功能
- 完整的用户注册表单
- 用户名、手机号、邮箱验证
- 密码强度实时检测
- 确认密码验证
- 图形验证码功能
- 用户协议同意确认
- 第三方注册（微信、QQ）
- 注册成功后自动跳转登录

## 文件结构

```
chengxu/
├── index.html          # 登录页面HTML结构
├── register.html       # 注册页面HTML结构
├── style.css           # 公共样式文件
├── register.css        # 注册页面专用样式
├── script.js           # 登录页面交互逻辑
├── register.js         # 注册页面交互逻辑
├── start.py            # Python启动脚本
├── start.sh            # Shell启动脚本
└── README.md           # 说明文档
```

## 使用方法

1. **打开页面**
   ```bash
   # 在浏览器中打开 index.html 文件
   open index.html
   ```

2. **测试登录**
   - 手机号格式：13812345678（或任何1开头的11位数字）
   - 邮箱格式：user@example.com
   - 密码：任意6位以上字符

3. **测试注册功能**
   - 点击登录页面的"免费注册"链接
   - 填写完整的注册表单
   - 验证码：输入页面显示的验证码（可点击刷新）
   - 密码强度：实时显示密码强度等级
   - 注册成功后自动跳转回登录页面

4. **切换登录方式**
   - 点击"手机"或"邮箱"标签切换登录模式
   - 手机模式显示国家代码选择器
   - 邮箱模式隐藏国家代码选择器

## 技术实现

### HTML特性
- 语义化HTML5标签
- 表单验证属性
- 可访问性支持

### CSS特性
- CSS3渐变和动画
- Flexbox布局
- 响应式媒体查询
- 现代浏览器兼容

### JavaScript特性
- ES6+语法
- 事件委托
- 表单验证
- DOM操作
- 模拟异步登录

## 自定义配置

### 修改品牌信息
在 `index.html` 中修改：
```html
<div class="brand">
    <h1>你的品牌</h1>
    <p class="domain">YOUR-DOMAIN.COM</p>
</div>
```

### 修改主题色彩
在 `style.css` 中修改：
```css
/* 背景渐变 */
background: linear-gradient(135deg, #你的颜色1 0%, #你的颜色2 100%);

/* 登录按钮 */
background: linear-gradient(45deg, #你的颜色1, #你的颜色2);
```

### 添加真实后端
在 `script.js` 的 `simulateLogin` 函数中替换为真实的API调用：
```javascript
// 替换模拟登录为真实API调用
async function authenticateUser(account, password, isPhone) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password, type: isPhone ? 'phone' : 'email' })
    });
    return response.json();
}
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发计划

- [ ] 短信验证码登录功能
- [ ] 找回密码功能
- [ ] 第三方登录集成（微信、QQ等）
- [ ] 用户注册页面
- [ ] 国际化多语言支持
- [ ] 更多主题选择

## 许可证

MIT License - 可自由使用和修改