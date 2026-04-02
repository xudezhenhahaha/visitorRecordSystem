# 心理咨询来访者记录系统

一个类似课表的心理咨询来访者管理应用，支持按周视图查看和管理来访者预约。

## 功能特点

- 📅 **周视图课表**：直观展示一周内所有时间段的来访者预约
- ➕ **添加预约**：点击任意时间段快速添加来访者信息
- ✏️ **编辑预约**：点击来访者卡片即可修改信息
- 🗑️ **删除预约**：支持删除不再需要的预约记录
- ⚠️ **时间冲突检测**：自动检测并阻止时间段冲突的预约
- 💾 **数据持久化**：使用 JSON 文件存储数据

## 来访者信息字段

- 姓名（必填）
- 性别（男/女）
- 联系电话
- 预约日期（必填）
- 开始时间（必填）
- 结束时间
- 备注

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务器

```bash
npm start
```

服务器将在 http://localhost:3001 启动

### 访问应用

打开浏览器访问 http://localhost:3001

## 使用说明

1. **切换周**：点击"上周"或"下周"按钮切换不同的周
2. **添加预约**：点击任意单元格的"+ 添加"按钮
3. **查看/编辑**：点击来访者卡片查看详情或编辑
4. **删除预约**：在编辑模态框中点击"删除"按钮

## 技术栈

- **后端**：Node.js + Express + LowDB
- **前端**：HTML5 + CSS3 + JavaScript + Bootstrap 5
- **数据存储**：JSON 文件（db.json）/ LocalStorage（离线模式）
- **移动端**：Android WebView

## 打包成 Android APK

### 方法一：使用 Android Studio（推荐）

1. 用 Android Studio 打开 `android` 文件夹
2. 等待 Gradle 同步完成
3. 点击 `Build` → `Build APK`
4. APK 位于：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法二：使用命令行

```bash
# 需要安装 Android SDK 和 JDK
./build-apk.sh
```

详细打包说明请查看 [ANDROID_BUILD.md](ANDROID_BUILD.md)

## 项目结构

```
visitorRecordSystem/
├── server.js          # 后端服务器
├── db.json            # 数据存储文件（自动生成）
├── package.json       # 项目配置
├── public/
│   ├── index.html     # 前端页面
│   └── app.js         # 前端逻辑
└── README.md          # 说明文档
```

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/visitors | 获取所有记录 |
| GET | /api/visitors/range | 按日期范围查询 |
| POST | /api/visitors | 创建新记录 |
| PUT | /api/visitors/:id | 更新记录 |
| DELETE | /api/visitors/:id | 删除记录 |
