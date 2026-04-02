# 🚀 快速打包 APK - 3 种方法

## 方法 1：Android Studio（最可靠）

```
1. 打开 Android Studio
2. File → Open → 选择 android 文件夹
3. 等待 Gradle 同步完成
4. Build → Build APK
5. APK 位置：android/app/build/outputs/apk/debug/app-debug.apk
```

**预计时间**：首次 10 分钟（下载依赖），之后 2 分钟

---

## 方法 2：GitHub Actions（自动打包）

```
1. 将项目推送到 GitHub
2. 在 GitHub 页面点击 Actions 标签
3. 选择 "Build Android APK" 工作流
4. 点击 "Run workflow"
5. 完成后在 Artifacts 中下载 APK
```

**预计时间**：5-8 分钟

---

## 方法 3：在线转换工具（最简单）

访问以下任一网站，上传 `public` 文件夹：

1. **WebIntoApp** - https://www.webintoapp.com/
2. **AppsGeyser** - https://www.appsgeyser.com/
3. **Median** - https://www.median.co/

**预计时间**：3-5 分钟

---

## 安装到华为鸿蒙手机

1. 将 APK 传到手机（微信/QQ/数据线）
2. 点击 APK 文件
3. 允许安装未知来源应用
4. 点击安装

---

## 文件说明

- `android/` - Android Studio 项目（方法 1）
- `public/` - 前端文件（方法 3 使用）
- `.github/workflows/` - GitHub Actions 配置（方法 2）
