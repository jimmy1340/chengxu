# chengxu

小程序开发demo

## 项目结构

### 📱 登录页面小程序
位置：`chengxu/` 目录

一个精美的登录页面小程序，模仿"上线了"网站的登录界面，具有现代化的UI设计和完整的交互功能。

#### 主要特性
- 🎨 紫色渐变背景，现代化设计
- 📱 响应式布局，支持手机和桌面端
- ✅ 完整的表单验证（手机号、邮箱、密码）
- 🔄 手机号/邮箱登录方式切换
- 📝 **完整的用户注册页面**
- 🔐 密码强度实时检测
- 🖼️ 图形验证码功能
- ⚡ 平滑的动画效果和交互体验
- 🌐 本地开发服务器支持

#### 快速开始

**方法1：使用shell脚本（推荐）**
```bash
cd chengxu
./start.sh
```

**方法2：使用Python脚本**
```bash
cd chengxu
python3 start.py
```

**方法3：直接在浏览器打开**
```bash
cd chengxu
open index.html  # macOS
# 或者用浏览器直接打开 index.html 文件
```

访问 http://localhost:8000 查看效果

#### 技术栈
- HTML5 + CSS3 + JavaScript
- 响应式设计
- 现代浏览器兼容
- 无框架依赖

#### 文件说明
```
chengxu/
├── index.html      # 登录页面
├── register.html   # 注册页面
├── style.css       # 公共样式文件
├── register.css    # 注册页面样式
├── script.js       # 登录页面逻辑
├── register.js     # 注册页面逻辑
├── start.py        # Python启动脚本
├── start.sh        # Shell启动脚本
└── README.md       # 详细说明文档
```

## 更多信息

详细功能说明和使用指南请查看 `chengxu/README.md` 文件。
