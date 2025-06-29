#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
登录页面小程序启动脚本
简单的HTTP服务器，用于在本地测试页面
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# 配置
PORT = 8000
HOST = 'localhost'

def start_server():
    """启动本地HTTP服务器"""
    
    # 切换到当前脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 创建HTTP服务器
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
            print(f"🚀 登录页面小程序启动成功!")
            print(f"📱 访问地址: http://{HOST}:{PORT}")
            print(f"🌐 自动打开浏览器中...")
            print(f"🛑 按 Ctrl+C 停止服务器")
            print("-" * 50)
            
            # 自动打开浏览器
            webbrowser.open(f'http://{HOST}:{PORT}')
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        print("👋 感谢使用!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # 端口被占用
            print(f"❌ 端口 {PORT} 已被占用")
            print(f"💡 请尝试更改端口号或关闭占用端口的程序")
        else:
            print(f"❌ 启动服务器时出错: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("=" * 50)
    print("🎯 登录页面小程序")
    print("📄 模仿 '上线了' 网站登录页面")
    print("=" * 50)
    start_server()