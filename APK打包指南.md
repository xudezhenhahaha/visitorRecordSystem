# 📱 心理咨询来访者记录 - APK 打包指南

## 方式一：使用 Android Studio（最简单，推荐）

### 步骤

1. **下载并安装 Android Studio**
   - 官网：https://developer.android.com/studio
   - 下载后按默认选项安装

2. **打开项目**
   - 启动 Android Studio
   - 点击 `File` → `Open`
   - 选择 `visitorRecordSystem/android` 文件夹
   - 点击 `OK`

3. **等待 Gradle 同步**
   - 首次打开会自动下载依赖（可能需要 5-10 分钟）
   - 等待底部状态栏显示 "Gradle build finished"

4. **构建 APK**
   - 点击菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - 等待构建完成（约 1-2 分钟）

5. **获取 APK 文件**
   - 构建完成后会弹出通知 "APK(s) generated successfully"
   - 点击通知中的 `locate` 打开文件夹
   - 或手动查找：`android/app/build/outputs/apk/debug/app-debug.apk`

6. **安装到手机**
   - 将 APK 文件复制到手机
   - 在手机上点击 APK 文件安装
   - 如提示"未知来源"，请允许安装

---

## 方式二：使用在线打包服务（无需安装 Android Studio）

### 选项 1：WebViewGold（推荐）

1. 访问：https://webviewgold.com/
2. 点击 "Try for free"
3. 上传 `public` 文件夹中的内容
4. 配置应用信息：
   - App Name: 心理咨询来访者记录
   - Package Name: com.visitor.record
5. 点击 "Build" 生成 APK
6. 下载 APK 文件

### 选项 2：Median

1. 访问：https://median.co/
2. 注册免费账号
3. 创建新项目，选择 "Convert a website"
4. 上传 `public` 文件夹
5. 配置后生成 APK

---

## 方式三：使用命令行（适合开发者）

### 前提条件

```bash
# 安装 JDK 17
sudo apt install openjdk-17-jdk  # Linux
brew install openjdk@17          # Mac

# 安装 Android SDK
# 下载：https://developer.android.com/studio#command-tools

# 设置环境变量（添加到 ~/.bashrc 或 ~/.zshrc）
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

### 编译命令

```bash
cd visitorRecordSystem/android

# Linux/Mac
./gradlew assembleDebug

# Windows
gradlew.bat assembleDebug
```

APK 输出位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 应用信息

| 项目 | 值 |
|------|-----|
| 应用名称 | 心理咨询来访者记录 |
| 包名 | com.visitor.record |
| 版本号 | 1.0 |
| 最低 Android | 5.1 (API 22) |
| 目标 Android | 14 (API 34) |
| APK 大小 | 约 2-3 MB |

---

## 华为鸿蒙手机安装说明

1. **传输 APK**
   - 通过 USB 数据线、微信文件传输助手、或蓝牙将 APK 传到手机

2. **允许安装**
   - 打开 APK 文件时，如提示"禁止安装未知来源应用"
   - 进入设置 → 安全 → 更多安全设置
   - 开启"外部来源应用检查"和"安装外部应用"

3. **安装应用**
   - 点击安装按钮
   - 等待安装完成

4. **首次使用**
   - 打开应用即可使用
   - 数据存储在本地，卸载会清除数据

---

## 常见问题

### Q: Gradle 同步失败
**A:** 检查网络连接，或使用国内镜像：
```gradle
// 在 android/build.gradle 的 repositories 中添加
maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/public' }
```

### Q: 构建时提示 SDK 版本不匹配
**A:** 打开 Android Studio → Tools → SDK Manager → 安装 Android 14 (API 34)

### Q: APK 安装失败
**A:** 检查手机 Android 版本是否 >= 5.1，或查看日志获取详细错误

### Q: 应用闪退
**A:** 打开手机开发者选项 → USB 调试 → 使用 adb logcat 查看错误日志

---

## 文件说明

```
android/
├── app/
│   ├── build.gradle           # Android 应用配置
│   └── src/main/
│       ├── AndroidManifest.xml # 应用清单
│       ├── java/.../MainActivity.java  # 主活动
│       ├── assets/public/     # 前端文件（HTML/JS）
│       └── res/               # 资源文件（图标、样式）
├── build.gradle               # 项目构建配置
└── gradlew                    # Gradle 包装器
```

---

## 技术支持

如有问题，请检查：
1. Android Studio 版本是否最新
2. Gradle 版本是否匹配（8.0+）
3. JDK 版本是否为 17
4. 网络连接是否正常
