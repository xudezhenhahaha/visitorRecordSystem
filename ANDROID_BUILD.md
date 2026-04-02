# Android APK 打包说明

## 方法一：使用 Android Studio（推荐）

### 前提条件
- 安装 Android Studio
- 安装 Android SDK（API 34）

### 步骤

1. **打开项目**
   - 启动 Android Studio
   - 选择 `File` → `Open`
   - 选择 `android` 文件夹

2. **等待 Gradle 同步**
   - 首次打开会自动下载依赖，可能需要几分钟

3. **构建 APK**
   - 点击菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - 等待构建完成

4. **获取 APK 文件**
   - 构建完成后，APK 位于：`android/app/build/outputs/apk/debug/app-debug.apk`

5. **安装到手机**
   - 将 APK 文件传输到华为鸿蒙手机
   - 在手机上打开 APK 文件进行安装
   - 如提示"未知来源"，请允许安装

---

## 方法二：使用命令行

### 前提条件
- 安装 JDK 17
- 安装 Android SDK
- 设置环境变量：
  - `ANDROID_HOME` 指向 SDK 目录
  - `PATH` 包含 `$ANDROID_HOME/platform-tools` 和 `$ANDROID_HOME/build-tools`

### 步骤

```bash
cd android

# Linux/Mac
./gradlew assembleDebug

# Windows
gradlew.bat assembleDebug
```

APK 输出位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 方法三：使用在线打包服务

如果本地没有 Android 开发环境，可以使用以下在线服务：

1. **WebViewGold** (https://webviewgold.com/)
2. **Median.co** (https://median.co/)
3. **GoNative** (https://gonative.io/)

上传 `public` 文件夹的内容，配置应用名称和包名，即可生成 APK。

---

## 应用信息

- **应用名称**: 心理咨询来访者记录
- **包名**: com.visitor.record
- **最低 Android 版本**: 5.1 (API 22)
- **目标 Android 版本**: 14 (API 34)

---

## 数据说明

应用使用本地存储（LocalStorage）保存数据，数据存储在应用沙盒中：
- 卸载应用会清除所有数据
- 建议定期备份重要数据
- 同一设备上不同应用之间数据不共享

---

## 常见问题

### Q: 安装时提示"禁止安装未知来源应用"
A: 在手机设置中允许该来源安装应用，或使用华为应用市场验证。

### Q: 应用闪退
A: 检查手机 Android 版本是否 >= 5.1，或查看日志获取详细错误信息。

### Q: 数据丢失
A: 应用使用本地存储，卸载会清除数据。建议增加云同步功能。
