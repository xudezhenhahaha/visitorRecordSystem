#!/bin/bash

# 心理咨询来访者记录系统 - 一键安装并编译 APK
# 自动安装 Java + Android SDK + 编译 APK

set -e

echo "=============================================="
echo "  心理咨询来访者记录系统 - APK 一键打包工具"
echo "=============================================="
echo ""

# 检测系统
OS_TYPE=$(uname -s)
echo "检测到操作系统：$OS_TYPE"

# 设置安装目录
INSTALL_DIR="$HOME/android-sdk"
export ANDROID_HOME="$INSTALL_DIR"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0"

# 检查 Java
if ! command -v java &> /dev/null; then
    echo ""
    echo "📦 未找到 Java，正在安装 OpenJDK 17..."
    
    if command -v apt &> /dev/null; then
        # Debian/Ubuntu
        sudo apt update
        sudo apt install -y openjdk-17-jdk wget unzip
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install -y java-17-openjdk wget unzip
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y java-17-openjdk wget unzip
    elif command -v pacman &> /dev/null; then
        # Arch Linux
        sudo pacman -S --noconfirm jdk-openjdk wget unzip
    else
        echo "❌ 无法自动安装 Java，请手动安装 OpenJDK 17"
        exit 1
    fi
    
    echo "✓ Java 安装完成"
fi

# 显示 Java 版本
java -version
echo ""

# 检查 Android SDK
if [ ! -d "$ANDROID_HOME" ]; then
    echo "📦 未找到 Android SDK，正在下载..."
    mkdir -p "$INSTALL_DIR"
    
    # 下载 Android Command Line Tools
    CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
    TOOLS_ZIP="$INSTALL_DIR/cmdline-tools.zip"
    
    echo "下载 Android Command Line Tools..."
    wget -q --show-progress "$CMDLINE_TOOLS_URL" -O "$TOOLS_ZIP"
    
    echo "解压..."
    mkdir -p "$INSTALL_DIR/cmdline-tools"
    unzip -q "$TOOLS_ZIP" -d "$INSTALL_DIR/cmdline-tools"
    mv "$INSTALL_DIR/cmdline-tools/cmdline-tools" "$INSTALL_DIR/cmdline-tools/latest"
    rm "$TOOLS_ZIP"
    
    echo "✓ Android SDK 下载完成"
fi

# 接受许可证
echo ""
echo "📋 接受 Android SDK 许可证..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

# 安装必要的 SDK 组件
echo ""
echo "📦 安装 Android SDK 组件..."
sdkmanager --install "platform-tools"
sdkmanager --install "platforms;android-34"
sdkmanager --install "build-tools;34.0.0"

echo "✓ SDK 组件安装完成"
echo ""

# 进入 android 目录
cd "$(dirname "$0")/android"

# 复制最新的 public 文件
echo "📁 复制前端文件..."
cp -f ../public/index.html app/src/main/assets/public/
cp -f ../public/app.js app/src/main/assets/public/

# 设置 gradlew 权限
chmod +x gradlew

# 编译 APK
echo ""
echo "=============================================="
echo "  开始编译 APK..."
echo "=============================================="
echo ""

./gradlew assembleDebug --no-daemon

# 检查编译结果
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo "=============================================="
    echo "  ✅ 编译成功!"
    echo "=============================================="
    echo ""
    echo "📱 APK 文件位置："
    echo "   $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "💡 安装方法："
    echo "   1. 将 APK 传输到手机"
    echo "   2. 在手机上点击 APK 文件"
    echo "   3. 允许安装未知来源应用"
    echo "   4. 点击安装"
    echo ""
    
    # 复制到项目根目录方便查找
    cp "app/build/outputs/apk/debug/app-debug.apk" ../app-debug.apk
    echo "📦 已复制 APK 到项目根目录：$(dirname $(pwd))/app-debug.apk"
else
    echo ""
    echo "=============================================="
    echo "  ❌ 编译失败"
    echo "=============================================="
    echo "请检查上方错误信息"
    exit 1
fi
