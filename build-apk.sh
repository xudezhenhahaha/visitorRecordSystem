#!/bin/bash

# 心理咨询来访者记录系统 - Android APK 编译脚本

echo "======================================"
echo "  心理咨询来访者记录系统 - APK 编译"
echo "======================================"

# 检查 Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "错误：未设置 ANDROID_HOME 环境变量"
    echo "请先安装 Android SDK 并设置环境变量"
    echo ""
    echo "在 ~/.bashrc 或 ~/.zshrc 中添加:"
    echo "  export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/build-tools"
    exit 1
fi

echo "✓ Android SDK: $ANDROID_HOME"

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "错误：未找到 Java，请安装 JDK 17"
    exit 1
fi

java_version=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
echo "✓ Java 版本：$java_version"

# 进入 android 目录
cd "$(dirname "$0")/android" || exit 1

# 检查 gradlew
if [ ! -f "gradlew" ]; then
    echo "正在下载 Gradle Wrapper..."
    # 创建 gradlew 脚本
    cat > gradlew << 'GRADLEW'
#!/bin/sh
exec gradle "$@"
GRADLEW
    chmod +x gradlew
fi

# 编译
echo ""
echo "开始编译 APK..."
echo ""

./gradlew assembleDebug

# 检查编译结果
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "======================================"
    echo "  ✓ 编译成功!"
    echo "======================================"
    echo ""
    echo "APK 文件位置：android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "将 APK 传输到手机即可安装"
else
    echo ""
    echo "======================================"
    echo "  ✗ 编译失败"
    echo "======================================"
    echo "请检查错误信息"
    exit 1
fi
