# 来访者记录系统

一个轻量级的来访者记录管理系统，适配手机浏览器访问，支持 GitHub Pages 部署。

## 功能特点

- 📱 完美适配手机浏览器
- 📅 按周管理来访者预约
- ⏰ 滑动式24小时制时间选择器
- 💾 本地存储，无需后端服务器
- 🚀 支持 GitHub Pages 一键部署

## 使用方法

### GitHub Pages 部署

1. 将此仓库 Fork 到您的 GitHub 账号
2. 进入仓库设置 → Pages
3. 选择部署来源为 **Deploy from a branch**
4. 选择分支为 `main`（或 `master`），文件夹选择 `/ (root)`
5. 保存后等待几秒即可完成部署

或者使用 GitHub Actions：
- 推送代码到 main 分支，GitHub Actions 会自动构建和部署

访问地址：`https://您的用户名.github.io/visitorRecordSystem/`

### 本地访问

直接在浏览器中打开 `index.html` 文件即可使用。

## 功能说明

- **上周/下周**：切换查看不同周的预约记录
- **+ 按钮**：添加新的来访者预约
- **点击卡片**：编辑已有预约
- **时间选择器**：上下滑动选择小时和分钟（24小时制）
- **数据存储**：所有数据保存在浏览器本地存储中

## 技术栈

- 纯前端实现（HTML + CSS + JavaScript）
- 无需任何框架和依赖
- 使用 LocalStorage 存储数据

## 浏览器兼容性

支持所有现代手机浏览器：
- Chrome Mobile
- Safari (iOS)
- Samsung Internet
- 微信内置浏览器
- QQ 浏览器
- UC 浏览器

## 许可证

MIT License
