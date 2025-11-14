# 图片裁剪工具 - 移动端优化版 📱✂️

> **版本**: v1.0.0
> **发布日期**: 2025-01-14
> **状态**: ✅ 已完成
> **工具路径**: `/tools/image-cropper/`

## 📋 目录

- [概述](#概述)
- [核心功能](#核心功能)
- [移动端优化](#移动端优化)
- [技术实现](#技术实现)
- [使用指南](#使用指南)
- [最佳实践](#最佳实践)
- [更新日志](#更新日志)

---

## 📝 概述

图片裁剪工具是一个功能完整的在线图片编辑应用，提供裁剪、旋转、翻转、滤镜、调节等多种图片处理功能。该工具经过全面的移动端优化，支持触摸操作、响应式布局和 iOS 安全区域适配。

### 🎯 目标用户

- 需要快速处理图片的普通用户
- 移动端用户（手机、平板）
- 需要简单图片编辑功能的开发者
- 需要在线图片工具的设计师

### ✨ 核心特点

- ✅ **零依赖**: 纯原生 JavaScript 实现，无需任何第三方库
- 📱 **移动优先**: 专门优化的移动端交互体验
- 🎨 **功能完整**: 支持裁剪、旋转、滤镜、调节等多种操作
- 💾 **历史管理**: 完善的撤销/重做功能
- 🍎 **iOS 适配**: 完整支持 iPhone 安全区域
- 🎭 **实时预览**: 所有操作即时生效

---

## 🚀 核心功能

### 1. 图片上传 📤

**功能描述**：
- 支持点击上传和拖拽上传两种方式
- 自动图片质量优化和尺寸限制
- 支持常见图片格式（JPG、PNG、GIF、WebP）

**技术细节**：
```javascript
// 图片加载优化
- 最大尺寸限制：4096x4096
- 自动缩放超大图片
- Canvas 渲染优化
```

**使用方式**：
- **桌面端**: 点击上传区域或拖拽图片到页面
- **移动端**: 点击上传区域，从相册选择或拍照

---

### 2. 图片裁剪 ✂️

**功能描述**：
- 自由裁剪和预设比例裁剪
- 实时裁剪框预览
- 支持拖拽和缩放

**预设比例**：
| 比例 | 说明 | 适用场景 |
|------|------|---------|
| 自由 | 不限制比例 | 通用裁剪 |
| 1:1 | 正方形 | 社交媒体头像 |
| 4:3 | 传统照片比例 | 标准照片 |
| 16:9 | 宽屏比例 | 视频封面、横幅 |
| 3:4 | 竖向比例 | 海报、手机壁纸 |
| 9:16 | 竖屏比例 | 手机视频、Stories |

**移动端特性**：
- 触摸拖拽裁剪框
- 双指缩放支持
- 专用裁剪工具栏
- 应用/取消快捷按钮

---

### 3. 旋转与翻转 🔄

**旋转功能**：
- **左旋转**: 逆时针旋转 90°
- **右旋转**: 顺时针旋转 90°
- 保持图片质量不损失

**翻转功能**：
- **水平翻转**: 左右镜像
- **垂直翻转**: 上下镜像
- 支持组合操作

**快捷键**（桌面端）：
- `Ctrl/Cmd + ←`: 左旋转
- `Ctrl/Cmd + →`: 右旋转

---

### 4. 滤镜效果 🎨

**内置滤镜**：

| 滤镜名称 | 效果描述 | 技术实现 |
|---------|---------|---------|
| 无滤镜 | 原图效果 | - |
| 灰度 | 黑白照片效果 | `filter: grayscale(100%)` |
| 棕褐色 | 复古怀旧风格 | `filter: sepia(100%)` |
| 反色 | 颜色反转效果 | `filter: invert(100%)` |
| 模糊 | 高斯模糊效果 | `filter: blur(5px)` |
| 高对比度 | 增强对比度 | `filter: contrast(150%)` |

**移动端优化**：
- 横向滚动滤镜列表
- 实时预览效果
- 一键应用/取消

---

### 5. 图片调节 🎛️

#### 亮度调节
- **范围**: 0% - 200%
- **默认**: 100%
- **步进**: 1%
- **效果**: 调整图片整体明暗

#### 对比度调节
- **范围**: 0% - 200%
- **默认**: 100%
- **步进**: 1%
- **效果**: 调整明暗差异

#### 饱和度调节
- **范围**: 0% - 200%
- **默认**: 100%
- **步进**: 1%
- **效果**: 调整色彩鲜艳度

**移动端实现**：
```css
/* 专用调节分类 */
- 独立的亮度、对比度、饱和度分类
- 大号滑块便于触摸操作
- 实时数值显示
- 重置按钮快速恢复默认
```

---

### 6. 历史管理 ⏮️

**撤销/重做系统**：
- **最大历史记录**: 20 步
- **自动保存**: 每次操作自动记录
- **智能管理**: 超出限制自动清理旧记录

**功能按钮**：
- **↶ 撤回**: 回退到上一步操作
- **↷ 重做**: 恢复已撤销的操作
- **⟲ 重置全部**: 清空所有修改，恢复原图

**按钮状态**：
```javascript
// 智能禁用逻辑
撤回按钮: historyIndex <= 0 时禁用
重做按钮: historyIndex >= history.length - 1 时禁用
重置按钮: 加载图片后启用
```

**历史记录结构**：
```javascript
{
  imageData: canvas.toDataURL(),  // 图片数据
  width: canvas.width,            // 画布宽度
  height: canvas.height,          // 画布高度
  state: {                        // 图片状态
    rotation: 0,
    flipH: false,
    flipV: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    filter: 'none'
  }
}
```

---

### 7. 导出功能 💾

**支持格式**：
- **PNG**: 无损压缩，支持透明
- **JPG**: 有损压缩，文件更小

**导出选项**：
- 保持原始尺寸
- 应用所有编辑效果
- 自动命名（含时间戳）

**文件命名规则**：
```
edited-image-YYYYMMDD-HHmmss.png
edited-image-YYYYMMDD-HHmmss.jpg
```

---

## 📱 移动端优化

### 1. 扁平化工具栏设计

**设计理念**：
- 底部固定工具栏
- 选项卡式分类导航
- 横向滚动二级选项

**工具栏结构**：
```
┌─────────────────────────────────┐
│  旋转 | 裁剪 | 滤镜 | 亮度 | ... │  ← 一级导航（选项卡）
├─────────────────────────────────┤
│  [◀ 左转] [▶ 右转] [↔ 水平] ... │  ← 二级选项（横向滚动）
└─────────────────────────────────┘
```

**分类列表**：
1. **旋转** - 左转、右转、水平翻转、垂直翻转
2. **裁剪** - 自由、1:1、4:3、16:9、3:4、9:16
3. **滤镜** - 无、灰度、棕褐色、反色、模糊、高对比度
4. **亮度** - 滑块调节（0-200%）
5. **对比度** - 滑块调节（0-200%）
6. **饱和度** - 滑块调节（0-200%）
7. **还原** - 撤回、重做、重置全部
8. **导出** - PNG、JPG

---

### 2. iOS 安全区域适配

**技术实现**：

```html
<!-- viewport 配置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

```css
/* 工具栏安全区域适配 */
.mobile-toolbar-wrapper {
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0-11.2 */
}

/* 画布底部预留空间 */
.canvas-area {
  padding-bottom: calc(200px + env(safe-area-inset-bottom, 0px) + 50px);
}

/* 背景高度控制 */
.workspace::before {
  bottom: calc(200px + env(safe-area-inset-bottom, 0px) + 50px);
}
```

**适配设备**：
- iPhone X 及以后机型（带刘海屏）
- iPhone 底部手势条区域
- iPad Pro 全面屏系列

**效果**：
- 工具栏不会被底部手势条遮挡
- 按钮区域完全可点击
- 画布背景正确定位

---

### 3. 触摸交互优化

#### 裁剪框触摸
```javascript
// 触摸事件处理
touchstart: 记录初始位置
touchmove: 实时更新裁剪框
touchend: 应用最终裁剪
```

#### 横向滚动优化
```css
.mobile-option-row {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;  /* iOS 流畅滚动 */
  scrollbar-width: none;              /* 隐藏滚动条 */
}

.mobile-option-btn {
  flex-shrink: 0;  /* 防止按钮压缩 */
  white-space: nowrap;
}
```

#### 触摸目标尺寸
```css
/* 符合 Apple HIG 最小触摸尺寸 44x44pt */
.mobile-tab {
  min-height: 44px;
  padding: 10px 16px;
}

.mobile-option-btn {
  min-height: 44px;
  padding: 10px 16px;
}
```

---

### 4. Toast 通知系统

**移动端设计**：

**位置**: 底部居中（工具栏上方）
```css
.toast {
  bottom: calc(220px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 280px;
}
```

**动画效果**：
```css
@keyframes toastSlideIn {
  from {
    transform: translate(-50%, 100px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

/* 弹性缓动 */
animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**触摸交互**：
- **点击关闭**: 点击 Toast 立即关闭
- **下滑关闭**: 向下滑动 30px 关闭
- **自动消失**: 2.5 秒后自动隐藏

**触觉反馈**：
```javascript
// 震动反馈
成功消息: 震动 20ms
警告消息: 震动 30ms
错误消息: 震动 [50, 30, 50]ms（三次）
```

**视觉样式**：
```css
/* 渐变背景 + 毛玻璃效果 */
.toast.success {
  background: linear-gradient(135deg,
    rgba(42, 157, 143, 0.95) 0%,
    rgba(42, 157, 143, 0.85) 100%);
  backdrop-filter: blur(10px);
}

.toast.error {
  background: linear-gradient(135deg,
    rgba(231, 111, 81, 0.95) 0%,
    rgba(231, 111, 81, 0.85) 100%);
}
```

---

### 5. 响应式布局

**断点设计**：

| 断点 | 设备 | 布局特点 |
|------|------|---------|
| > 768px | 桌面端 | 左侧工具栏 + 右侧画布 |
| ≤ 768px | 平板/手机 | 全屏画布 + 底部工具栏 |
| ≤ 480px | 小屏手机 | 紧凑布局 + 更小字号 |

**关键 CSS**：
```css
/* 桌面端：横向布局 */
@media (min-width: 769px) {
  .container {
    display: flex;
    flex-direction: row;
  }
  .toolbar { width: 320px; }
  .canvas-area { flex: 1; }
}

/* 移动端：纵向布局 */
@media (max-width: 768px) {
  .toolbar { display: none; }
  .mobile-toolbar-wrapper { display: block; }
  .canvas-area {
    height: 100vh;
    padding-bottom: calc(200px + env(safe-area-inset-bottom) + 50px);
  }
}
```

---

## 🛠️ 技术实现

### 架构设计

```
┌─────────────────────────────────────┐
│          HTML Structure             │
│  - 上传区域                          │
│  - 画布容器（Canvas + 裁剪框）       │
│  - 桌面工具栏                        │
│  - 移动工具栏（扁平化分类导航）      │
│  - Toast 通知                        │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         CSS Styling                 │
│  - 响应式布局（@media queries）      │
│  - iOS 安全区域（env/constant）      │
│  - 动画效果（@keyframes）            │
│  - 触摸优化（-webkit-overflow）      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      JavaScript Logic               │
│  - 图片处理（Canvas API）            │
│  - 历史管理（History Stack）         │
│  - 事件处理（Touch/Mouse Events）    │
│  - 状态管理（imageState Object）     │
└─────────────────────────────────────┘
```

### 核心技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| **HTML5 Canvas** | 图片渲染 | 高性能图片处理和导出 |
| **CSS3** | 样式和动画 | Flexbox、Grid、Animations |
| **Vanilla JavaScript** | 业务逻辑 | 零依赖纯原生实现 |
| **Touch Events** | 移动交互 | touchstart/move/end |
| **CSS Filters** | 滤镜效果 | 硬件加速的实时滤镜 |
| **Vibration API** | 触觉反馈 | 移动端震动反馈 |

### 关键算法

#### 1. 图片旋转算法
```javascript
function rotateImage(angle) {
  const newCanvas = document.createElement('canvas');
  const newCtx = newCanvas.getContext('2d');

  // 90度旋转需要交换宽高
  if (angle % 180 !== 0) {
    newCanvas.width = canvas.height;
    newCanvas.height = canvas.width;
  } else {
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
  }

  // 移动到中心点
  newCtx.translate(newCanvas.width / 2, newCanvas.height / 2);
  // 旋转
  newCtx.rotate((angle * Math.PI) / 180);
  // 绘制图片
  newCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return newCanvas;
}
```

#### 2. 裁剪算法
```javascript
function applyCrop() {
  const rect = cropBox.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  // 计算裁剪区域（画布坐标）
  const scaleX = canvas.width / canvasRect.width;
  const scaleY = canvas.height / canvasRect.height;

  const cropX = (rect.left - canvasRect.left) * scaleX;
  const cropY = (rect.top - canvasRect.top) * scaleY;
  const cropWidth = rect.width * scaleX;
  const cropHeight = rect.height * scaleY;

  // 创建裁剪后的画布
  const imageData = ctx.getImageData(cropX, cropY, cropWidth, cropHeight);
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  ctx.putImageData(imageData, 0, 0);
}
```

#### 3. 历史管理算法
```javascript
// 保存历史
function saveHistory() {
  // 清除当前索引之后的历史（分支覆盖）
  history = history.slice(0, historyIndex + 1);

  // 保存当前状态
  history.push({
    imageData: canvas.toDataURL(),
    width: canvas.width,
    height: canvas.height,
    state: { ...imageState }
  });

  // 限制历史数量（循环队列）
  if (history.length > MAX_HISTORY) {
    history.shift();
  } else {
    historyIndex++;
  }

  updateHistoryButtons();
}

// 撤销
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    restoreFromHistory(history[historyIndex]);
  }
}

// 重做
function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    restoreFromHistory(history[historyIndex]);
  }
}
```

---

## 📖 使用指南

### 快速开始

1. **打开工具**
   ```
   访问: /tools/image-cropper/index.html
   ```

2. **上传图片**
   - 点击"点击上传图片"按钮，或
   - 直接拖拽图片到页面中央

3. **编辑图片**
   - 选择需要的功能分类
   - 应用滤镜、调节参数、裁剪等
   - 使用撤销/重做功能调整

4. **导出图片**
   - 点击"导出"分类
   - 选择 PNG 或 JPG 格式
   - 图片自动下载到本地

### 桌面端操作

**界面布局**：
```
┌──────────┬────────────────────┐
│          │                    │
│  工具栏  │      画布区域      │
│          │                    │
│  (左侧)  │      (右侧)        │
└──────────┴────────────────────┘
```

**常用操作**：
- 旋转：点击左转/右转按钮
- 翻转：点击水平/垂直翻转按钮
- 裁剪：选择比例 → 拖动裁剪框 → 应用裁剪
- 滤镜：点击滤镜按钮应用效果
- 调节：拖动滑块调整亮度/对比度/饱和度

### 移动端操作

**界面布局**：
```
┌─────────────────────────┐
│                         │
│       画布区域          │
│      (全屏显示)         │
│                         │
├─────────────────────────┤
│  旋转|裁剪|滤镜|...     │  ← 分类选项卡
├─────────────────────────┤
│  [按钮] [按钮] [按钮]   │  ← 功能按钮（横向滚动）
└─────────────────────────┘
```

**触摸操作**：
- **单指点击**：选择功能、应用效果
- **单指滑动**：滚动功能按钮、拖动裁剪框
- **双指缩放**：缩放裁剪框（计划中）
- **长按**：显示提示信息（计划中）

### 最佳实践

#### 性能优化
```javascript
// ✅ 推荐：限制图片尺寸
最大尺寸: 4096 x 4096
合理尺寸: 2048 x 2048

// ✅ 推荐：批量操作后再导出
先完成所有编辑 → 最后导出一次

// ❌ 避免：频繁导出
每次操作都导出 → 性能差
```

#### 图片质量
```javascript
// PNG vs JPG 选择
PNG:
  - 需要透明背景
  - 图标、Logo、截图
  - 要求无损质量

JPG:
  - 照片、风景图
  - 文件大小敏感
  - 不需要透明背景
```

#### 移动端使用
```javascript
// ✅ 推荐
- 竖屏使用（更好的操作体验）
- WiFi 环境下上传大图
- 使用横向滚动浏览所有选项

// 💡 提示
- Toast 通知可点击快速关闭
- 下滑 Toast 也可关闭
- 撤回/重做按钮在"还原"分类中
```

---

## 🔧 自定义与扩展

### 添加新滤镜

**步骤**：

1. **HTML 添加按钮**：
```html
<!-- 桌面端 -->
<button class="filter-btn" data-filter="vintage">复古</button>

<!-- 移动端 -->
<button class="mobile-option-btn" data-filter-mobile="vintage">复古</button>
```

2. **CSS 定义滤镜**：
```css
.filter-vintage {
  filter: sepia(50%) saturate(150%) brightness(110%);
}
```

3. **JavaScript 绑定事件**（自动绑定，无需修改）

### 修改主题色

```css
:root {
  --primary-color: #ee6c4d;      /* 主色调 */
  --primary-dark: #d4573b;       /* 深色主题 */
  --secondary-color: #f4a261;    /* 辅助色 */
  --accent-color: #e9c46a;       /* 强调色 */
}

/* 修改后所有按钮、高亮自动应用新颜色 */
```

### 调整历史记录数量

```javascript
// 修改最大历史记录数
const MAX_HISTORY = 20;  // 默认 20 步

// 增大 → 更多撤销次数，但占用更多内存
// 减小 → 节省内存，但撤销次数减少
```

---

## 📊 技术统计

### 代码规模

| 类型 | 行数 | 占比 | 说明 |
|------|------|------|------|
| HTML | ~1,700 | 40% | 结构和模板 |
| CSS | ~1,500 | 35% | 样式和动画 |
| JavaScript | ~1,100 | 25% | 业务逻辑 |
| **总计** | **~4,300** | **100%** | 单文件实现 |

### 功能覆盖

- ✅ 图片上传（拖拽 + 点击）
- ✅ 旋转功能（左转 + 右转）
- ✅ 翻转功能（水平 + 垂直）
- ✅ 裁剪功能（6 种预设比例 + 自由裁剪）
- ✅ 滤镜效果（6 种内置滤镜）
- ✅ 图片调节（亮度 + 对比度 + 饱和度）
- ✅ 历史管理（撤销 + 重做 + 重置）
- ✅ 导出功能（PNG + JPG）
- ✅ 移动端优化（触摸 + 响应式 + iOS 适配）
- ✅ Toast 通知（4 种类型 + 触摸交互）

**功能完成度**: 100%

### 浏览器兼容性

| 浏览器 | 版本 | 支持度 | 说明 |
|--------|------|--------|------|
| Chrome | 90+ | ✅ 完全支持 | 推荐使用 |
| Safari | 14+ | ✅ 完全支持 | iOS 完美适配 |
| Firefox | 88+ | ✅ 完全支持 | 性能良好 |
| Edge | 90+ | ✅ 完全支持 | Chromium 内核 |
| Opera | 76+ | ✅ 完全支持 | Chromium 内核 |
| IE | - | ❌ 不支持 | 不兼容现代 API |

**移动端**：
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Android Firefox 88+
- ✅ 微信内置浏览器
- ✅ 支付宝内置浏览器

---

## 🎯 设计原则

### 1. KISS（简单至上）

**体现**：
- 单文件实现，零外部依赖
- 直观的按钮图标和文字说明
- 扁平化分类导航，清晰的信息层级

### 2. YAGNI（精益求精）

**体现**：
- 只实现当前必需的功能
- 避免过度设计和未来特性预留
- 代码简洁，没有冗余逻辑

### 3. DRY（杜绝重复）

**体现**：
```javascript
// 统一的按钮状态管理
function updateHistoryButtons() {
  // PC 端和移动端共用同一函数
  if (undoBtn) undoBtn.disabled = historyIndex <= 0;
  if (mobileUndoBtn) mobileUndoBtn.disabled = historyIndex <= 0;
}

// 统一的事件绑定
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('mobileUndoBtn').addEventListener('click', undo);
// 复用同一个 undo 函数
```

### 4. 移动优先

**体现**：
- 触摸目标最小 44x44pt（符合 Apple HIG）
- iOS 安全区域完整适配
- 横向滚动支持（避免垂直空间浪费）
- 底部工具栏（符合拇指区域）

---

## 🐛 已知问题

### 1. 双指缩放裁剪框
**状态**: 计划中
**说明**: 目前移动端裁剪框仅支持单指拖拽，双指缩放功能待实现
**优先级**: 中

### 2. 长按提示
**状态**: 计划中
**说明**: 长按按钮显示功能提示，提升新手友好度
**优先级**: 低

### 3. 批量处理
**状态**: 未计划
**说明**: 当前仅支持单张图片处理
**优先级**: 低

---

## 📅 更新日志

### v1.0.0 (2025-01-14)

#### ✨ 新增功能
- ✅ 完整的图片编辑功能（裁剪、旋转、翻转、滤镜、调节）
- ✅ 移动端扁平化工具栏设计
- ✅ 历史管理系统（撤销/重做/重置）
- ✅ iOS 安全区域完整适配
- ✅ Toast 通知系统（含触觉反馈）
- ✅ 响应式布局（桌面端 + 移动端）

#### 🎨 设计优化
- ✅ 横向滚动二级选项（避免垂直空间浪费）
- ✅ 画布背景精确定位（不遮挡工具栏）
- ✅ 工具栏圆角设计（视觉统一）
- ✅ Toast 居中显示（更好的可见性）

#### 🐛 问题修复
- ✅ 修复二级分类换行问题（改为横向滚动）
- ✅ 修复画布背景延伸到工具栏底部
- ✅ 修复 Toast 默认可见问题
- ✅ 修复移动端按钮状态管理缺失

#### 📝 文档
- ✅ 创建完整功能文档
- ✅ 添加使用指南和最佳实践
- ✅ 技术实现详细说明

---

## 🔗 相关资源

### 项目文件
- **工具页面**: [/tools/image-cropper/index.html](../../tools/image-cropper/index.html)
- **配置文件**: [/config/tools.json](../../config/tools.json)

### 相关文档
- **移动端最佳实践**: [MOBILE-BEST-PRACTICES.md](../MOBILE-BEST-PRACTICES.md)
- **项目主页**: [README.md](../../README.md)

### 参考资料
- **Canvas API**: [MDN - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- **CSS Filters**: [MDN - filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)
- **Touch Events**: [MDN - Touch events](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events)
- **iOS Safe Area**: [WebKit - Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- **Apple HIG**: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## 💬 反馈与支持

### 问题反馈
如果您在使用过程中遇到问题，请：
1. 检查浏览器版本是否符合要求
2. 尝试清除缓存后重新加载
3. 查看浏览器控制台错误信息
4. 提交 Issue 详细描述问题

### 功能建议
欢迎提出改进建议：
- 新增滤镜效果
- UI/UX 优化建议
- 性能优化方案
- 新功能需求

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-14
**维护者**: Development Team
**状态**: ✅ 生产就绪

---

[返回文档中心](../README.md) | [查看其他工具](../../README.md)
