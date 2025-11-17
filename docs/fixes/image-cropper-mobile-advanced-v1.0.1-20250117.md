# 图片裁剪工具 - 移动端高级功能修复

**版本**: v1.0.1
**修复日期**: 2025-01-17
**问题严重度**: 高（功能不可用 + JavaScript错误）
**影响范围**: 移动端高级功能完全不可用

---

## 📋 目录

- [问题概述](#问题概述)
- [修复的问题](#修复的问题)
- [技术细节](#技术细节)
- [测试验证](#测试验证)
- [相关文件](#相关文件)

---

## 问题概述

移动端高级功能存在多个严重问题，导致用户无法正常使用水印、圆角、边框、阴影等功能。

### 影响范围

- 🚫 移动端无法访问高级功能设置
- 🚫 阴影模糊会改变图片大小
- 🚫 阴影效果不显示
- 🚫 圆角只支持统一设置
- 🚫 移动端缺少下拉选择器
- 🚫 JavaScript错误导致按钮无响应

---

## 修复的问题

### 1. ❌ 阴影模糊改变图片大小

**问题描述**：
用户反馈"模糊设置现在效果会改变图片大小"，调整阴影模糊度时图片会缩小。

**原因分析**：
在 `renderImage()` 函数中，绘制区域计算错误地将阴影模糊值从画布尺寸中减去：

```javascript
// ❌ 错误代码
const drawWidth = canvas.width - (borderWidth * 2) - (shadowBlur * 2);
const drawHeight = canvas.height - (borderWidth * 2) - (shadowBlur * 2);
```

**修复方案**：
阴影是纯视觉效果，不应影响画布尺寸，只减去边框宽度：

```javascript
// ✅ 修复后
const borderWidth = imageState.border.enabled ? imageState.border.width : 0;
const drawWidth = canvas.width - (borderWidth * 2);
const drawHeight = canvas.height - (borderWidth * 2);
```

**修复文件**: [index.html:3357-3473](../../tools/image-cropper/index.html#L3357-L3473)

---

### 2. ❌ 阴影模糊度无效果

**问题描述**：
用户反馈"模糊度修改后图片没有效果"，调整阴影模糊滑块时图片无变化。

**原因分析**：
阴影在绘制边框后立即被清除，导致图片绘制时没有阴影效果：

```javascript
// ❌ 错误逻辑
ctx.shadowBlur = shadowBlur;
ctx.fillRect(...); // 绘制边框
ctx.shadowColor = 'transparent'; // 立即清除阴影
ctx.shadowBlur = 0;
// 后续绘制图片时已无阴影
```

**修复方案**：
条件性清除阴影——只有启用边框时才在绘制边框后清除，否则保留阴影用于图片：

```javascript
// ✅ 修复后
// 设置阴影（应用于边框或图片）
if (imageState.shadow.enabled && imageState.shadow.blur > 0) {
  ctx.shadowColor = hexToRgba(imageState.shadow.color, imageState.shadow.opacity);
  ctx.shadowBlur = imageState.shadow.blur;
}

// 绘制边框
if (imageState.border.enabled) {
  ctx.fillStyle = imageState.border.color;
  // ... 绘制边框

  // 清除阴影避免在图片上重复
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
// 如果没有边框，阴影保留用于图片绘制
```

**修复文件**: [index.html:3510-3533](../../tools/image-cropper/index.html#L3510-L3533)

---

### 3. ❌ 圆角只支持统一设置

**问题描述**：
用户要求"圆角设置应该支持四个角独立设置和统一设置"。

**实现方案**：

#### A. 扩展状态结构

```javascript
borderRadius: {
  enabled: false,
  mode: 'unified',     // 'unified' 或 'individual'
  value: 0,            // 统一圆角值
  topLeft: 0,          // 左上角
  topRight: 0,         // 右上角
  bottomLeft: 0,       // 左下角
  bottomRight: 0       // 右下角
}
```

#### B. 创建通用圆角路径函数

```javascript
function roundRectPath(ctx, x, y, width, height, radius) {
  let r = { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };

  // 支持数字（统一）或对象（独立）
  if (typeof radius === 'number') {
    r.topLeft = r.topRight = r.bottomRight = r.bottomLeft = radius;
  } else {
    r.topLeft = radius.topLeft || 0;
    r.topRight = radius.topRight || 0;
    r.bottomRight = radius.bottomRight || 0;
    r.bottomLeft = radius.bottomLeft || 0;
  }

  ctx.beginPath();
  ctx.moveTo(x + r.topLeft, y);

  // 顶部边 -> 右上角
  ctx.lineTo(x + width - r.topRight, y);
  if (r.topRight > 0) {
    ctx.quadraticCurveTo(x + width, y, x + width, y + r.topRight);
  }

  // 右侧边 -> 右下角
  ctx.lineTo(x + width, y + height - r.bottomRight);
  if (r.bottomRight > 0) {
    ctx.quadraticCurveTo(x + width, y + height, x + width - r.bottomRight, y + height);
  }

  // 底部边 -> 左下角
  ctx.lineTo(x + r.bottomLeft, y + height);
  if (r.bottomLeft > 0) {
    ctx.quadraticCurveTo(x, y + height, x, y + height - r.bottomLeft);
  }

  // 左侧边 -> 左上角
  ctx.lineTo(x, y + r.topLeft);
  if (r.topLeft > 0) {
    ctx.quadraticCurveTo(x, y, x + r.topLeft, y);
  }

  ctx.closePath();
}
```

#### C. PC端UI

```html
<div class="border-radius-controls" id="borderRadiusControls" style="display: none;">
  <!-- 圆角模式切换 -->
  <div class="control-row" style="margin-bottom: 12px;">
    <select class="tool-select" id="borderRadiusMode">
      <option value="unified">统一圆角</option>
      <option value="individual">独立设置</option>
    </select>
  </div>

  <!-- 统一圆角 -->
  <div id="unifiedRadiusControl">
    <div class="slider-control">
      <div class="slider-label">
        <span>圆角大小</span>
        <span class="slider-value" id="borderRadiusValue">0px</span>
      </div>
      <input type="range" id="borderRadiusSlider" min="0" max="200" value="0" />
    </div>
  </div>

  <!-- 独立圆角 -->
  <div id="individualRadiusControl" style="display: none;">
    <div class="slider-control">
      <div class="slider-label">
        <span>↖️ 左上</span>
        <span class="slider-value" id="radiusTopLeftValue">0px</span>
      </div>
      <input type="range" id="radiusTopLeft" min="0" max="200" value="0" />
    </div>
    <!-- 右上、左下、右下类似结构 -->
  </div>
</div>
```

#### D. 移动端UI

与PC端结构相同，ID添加 `mobile` 前缀：
- `mobileBorderRadiusMode`
- `mobileRadiusTopLeft` 等

#### E. 双向同步事件监听器

PC端和移动端控件完全同步，修改任一端都会更新另一端。

**修复文件**:
- PC端UI: [index.html:1897-1948](../../tools/image-cropper/index.html#L1897-L1948)
- 移动端UI: [index.html:2376-2425](../../tools/image-cropper/index.html#L2376-L2425)
- 状态结构: [index.html:2510-2518](../../tools/image-cropper/index.html#L2510-L2518)
- 路径函数: [index.html:3497-3539](../../tools/image-cropper/index.html#L3497-L3539)
- PC事件监听: [index.html:2704-2767](../../tools/image-cropper/index.html#L2704-L2767)
- 移动端事件监听: [index.html:3176-3239](../../tools/image-cropper/index.html#L3176-L3239)

---

### 4. ❌ 移动端缺少下拉选择器

**问题描述**：
用户反馈"移动端没有同步pc端功能"，移动端缺少裁剪比例、滤镜、翻转的下拉选择器。

**实现方案**：

#### A. 裁剪比例下拉选择器

```html
<select class="tool-select" id="mobileRatioSelect" style="margin-bottom: 12px;">
  <option value="free">自由裁剪</option>
  <option value="1:1">正方形 (1:1)</option>
  <option value="4:3">横屏 (4:3)</option>
  <option value="16:9">宽屏 (16:9)</option>
  <option value="3:4">竖屏 (3:4)</option>
  <option value="9:16">手机屏 (9:16)</option>
  <option value="2:3">照片 (2:3)</option>
  <option value="3:2">相机 (3:2)</option>
</select>
```

#### B. 滤镜下拉选择器

```html
<select class="tool-select" id="mobileFilterSelect" style="margin-bottom: 12px;">
  <option value="none">原图</option>
  <option value="grayscale">⚫ 黑白</option>
  <option value="sepia">📜 复古</option>
  <option value="invert">🔄 反色</option>
  <option value="blur">🌫️ 模糊</option>
  <option value="saturate">🌈 鲜艳</option>
</select>
```

#### C. 翻转下拉选择器 + 旋转按钮

```html
<div style="display: flex; gap: 8px; margin-bottom: 12px;">
  <select class="tool-select" id="mobileFlipSelect" style="flex: 1;">
    <option value="">选择翻转方式</option>
    <option value="horizontal">↔️ 水平翻转</option>
    <option value="vertical">↕️ 垂直翻转</option>
  </select>
  <button class="icon-btn" id="mobileRotateLeftBtn2" disabled title="左旋90°">↶</button>
  <button class="icon-btn" id="mobileRotateRightBtn2" disabled title="右旋90°">↷</button>
</div>
```

#### D. 双向同步

所有控件都与PC端完全同步：
- 修改PC端下拉选择器 → 移动端自动更新
- 修改移动端下拉选择器 → PC端自动更新
- 图片状态和canvas渲染实时同步

**修复文件**:
- 比例选择器: [index.html:2203-2212](../../tools/image-cropper/index.html#L2203-L2212)
- 滤镜选择器: [index.html:2234-2241](../../tools/image-cropper/index.html#L2234-L2241)
- 翻转选择器: [index.html:2285-2293](../../tools/image-cropper/index.html#L2285-L2293)
- 事件监听器: [index.html:2859-2941](../../tools/image-cropper/index.html#L2859-L2941)

---

### 5. ❌ 移动端无高级功能入口

**问题描述**：
用户反馈"移动端并没有显示高级功能设置项"，移动端完全无法访问水印、圆角、边框、阴影等高级功能。

**原因分析**：
移动端使用扁平标签页导航，但没有"高级"标签页，抽屉系统标记为"deprecated"但实际需要用于高级功能详细设置。

**实现方案**：

#### A. 添加"高级"标签页

```html
<button class="mobile-tab" data-tab="advanced">高级</button>
```

#### B. 创建快捷按钮

```html
<div class="mobile-tab-content" id="tabAdvanced">
  <div class="mobile-option-row">
    <button class="mobile-option-btn" id="mobileAdvancedWatermark" disabled>💧 水印</button>
    <button class="mobile-option-btn" id="mobileAdvancedRadius" disabled>⭕ 圆角</button>
    <button class="mobile-option-btn" id="mobileAdvancedBorder" disabled>🖼️ 边框</button>
    <button class="mobile-option-btn" id="mobileAdvancedShadow" disabled>🌫️ 阴影</button>
  </div>
</div>
```

#### C. 启用抽屉系统

移除 `display: none`，启用抽屉用于高级功能详细设置。

#### D. 抽屉控制函数

```javascript
// 打开抽屉
function openMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁用背景滚动
  }
}

// 关闭抽屉
function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // 恢复滚动
  }
}
```

#### E. 快捷按钮点击处理

```javascript
document.getElementById('mobileAdvancedWatermark').addEventListener('click', function() {
  openMobileDrawer();
  setTimeout(() => {
    const watermarkSection = document.querySelector('.drawer-content .drawer-section');
    if (watermarkSection) {
      watermarkSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
});

// 圆角、边框、阴影按钮类似处理
```

**修复文件**:
- 高级标签: [index.html:2047](../../tools/image-cropper/index.html#L2047)
- 快捷按钮: [index.html:2114-2122](../../tools/image-cropper/index.html#L2114-L2122)
- 抽屉元素: [index.html:2200-2204](../../tools/image-cropper/index.html#L2200-L2204)
- 控制函数: [index.html:2916-2941](../../tools/image-cropper/index.html#L2916-L2941)
- 按钮处理: [index.html:2871-2913](../../tools/image-cropper/index.html#L2871-L2913)

---

### 6. ❌ JavaScript重复声明错误

**问题描述**：
控制台报错：`Uncaught SyntaxError: Identifier 'drawerOverlay' has already been declared (at index.html:3541:15)`
移动端按钮点击无响应。

**原因分析**：
发现多处重复声明和重复函数定义：

```javascript
// ❌ 第一次声明（行 2946）
const drawerOverlay = document.getElementById('drawerOverlay');

// ❌ 第二次声明（行 3541）
const drawerOverlay = document.getElementById('drawerOverlay'); // 错误！

// ❌ 第一次定义（行 2916）
function openMobileDrawer() { ... }

// ❌ 第二次定义（行 4948）
function openMobileDrawer() { ... } // 错误！
```

**修复方案**：

1. **移除旧代码块**（行 3540-3549）：
   ```javascript
   // ❌ 删除
   const drawerOverlay = document.getElementById('drawerOverlay');
   if (drawerOverlay) {
     drawerOverlay.addEventListener('click', closeMobileDrawer);
   }
   ```

2. **移除重复函数定义**（行 4947-4980）：
   ```javascript
   // ❌ 删除
   function openMobileDrawer() { ... }
   function closeMobileDrawer() { ... }
   ```

3. **保留优化后的唯一实现**（行 2916-2948）：
   ```javascript
   // ✅ 唯一的正确实现
   function openMobileDrawer() {
     const drawer = document.getElementById('mobileDrawer');
     const overlay = document.getElementById('drawerOverlay');
     if (drawer && overlay) {
       drawer.classList.add('active');
       overlay.classList.add('active');
       document.body.style.overflow = 'hidden';
     }
   }

   function closeMobileDrawer() {
     const drawer = document.getElementById('mobileDrawer');
     const overlay = document.getElementById('drawerOverlay');
     if (drawer && overlay) {
       drawer.classList.remove('active');
       overlay.classList.remove('active');
       document.body.style.overflow = '';
     }
   }

   // 唯一的事件绑定
   const drawerOverlay = document.getElementById('drawerOverlay');
   if (drawerOverlay) {
     drawerOverlay.addEventListener('click', closeMobileDrawer);
   }
   ```

**修复结果**：
- ✅ 无JavaScript语法错误
- ✅ 抽屉控制函数正常工作
- ✅ 按钮点击响应恢复
- ✅ 代码更清晰、更安全

**修复文件**: [index.html:2916-2948](../../tools/image-cropper/index.html#L2916-L2948)

---

## 技术细节

### 修复前后对比

#### 问题1: 阴影改变图片大小

```diff
function renderImage() {
  const borderWidth = imageState.border.enabled ? imageState.border.width : 0;
- const shadowBlur = imageState.shadow.enabled ? imageState.shadow.blur : 0;
- const drawWidth = canvas.width - (borderWidth * 2) - (shadowBlur * 2);
- const drawHeight = canvas.height - (borderWidth * 2) - (shadowBlur * 2);
+ const drawWidth = canvas.width - (borderWidth * 2);
+ const drawHeight = canvas.height - (borderWidth * 2);
}
```

#### 问题2: 阴影无效果

```diff
function renderImage() {
+ // 设置阴影（应用于边框或图片）
+ if (imageState.shadow.enabled && imageState.shadow.blur > 0) {
+   ctx.shadowColor = hexToRgba(imageState.shadow.color, imageState.shadow.opacity);
+   ctx.shadowBlur = imageState.shadow.blur;
+ }
+
  if (imageState.border.enabled) {
    ctx.fillStyle = imageState.border.color;
    // ... 绘制边框
-   ctx.shadowColor = 'transparent';
-   ctx.shadowBlur = 0;
+   // 清除阴影避免在图片上重复
+   ctx.shadowColor = 'transparent';
+   ctx.shadowBlur = 0;
  }
+ // 如果没有边框，阴影保留用于图片绘制
}
```

#### 问题3: 圆角独立设置

```diff
imageState: {
  borderRadius: {
    enabled: false,
+   mode: 'unified',
    value: 0,
+   topLeft: 0,
+   topRight: 0,
+   bottomLeft: 0,
+   bottomRight: 0
  }
}
```

#### 问题6: 重复声明

```diff
- // 行 3541（删除）
- const drawerOverlay = document.getElementById('drawerOverlay');
-
- // 行 4948（删除）
- function openMobileDrawer() { ... }
-
- // 行 4973（删除）
- function closeMobileDrawer() { ... }

+ // 行 2916（唯一保留）
+ function openMobileDrawer() {
+   const drawer = document.getElementById('mobileDrawer');
+   const overlay = document.getElementById('drawerOverlay');
+   if (drawer && overlay) {
+     drawer.classList.add('active');
+     overlay.classList.add('active');
+     document.body.style.overflow = 'hidden';
+   }
+ }
```

### 核心算法改进

#### roundRectPath() 函数

支持灵活的圆角参数：

```javascript
// 使用方式 1: 统一圆角
roundRectPath(ctx, 0, 0, 300, 200, 20);

// 使用方式 2: 独立圆角
roundRectPath(ctx, 0, 0, 300, 200, {
  topLeft: 30,
  topRight: 0,
  bottomLeft: 0,
  bottomRight: 30
});
```

四角圆滑曲线使用 `quadraticCurveTo()` 实现，确保视觉效果自然。

### 状态同步机制

PC端和移动端控件完全双向同步：

```javascript
// PC端修改 → 同步到移动端
document.getElementById('borderRadiusSlider').addEventListener('input', function() {
  imageState.borderRadius.value = parseInt(this.value);
  document.getElementById('mobileBorderRadiusSlider').value = this.value;
  document.getElementById('mobileBorderRadiusValue').textContent = this.value + 'px';
  renderImage();
});

// 移动端修改 → 同步到PC端
document.getElementById('mobileBorderRadiusSlider').addEventListener('input', function() {
  imageState.borderRadius.value = parseInt(this.value);
  document.getElementById('borderRadiusSlider').value = this.value;
  document.getElementById('borderRadiusValue').textContent = this.value + 'px';
  renderImage();
});
```

---

## 测试验证

### 自动化测试清单

#### 阴影功能

- [x] 调整阴影模糊度，图片大小保持不变
- [x] 启用阴影且无边框，阴影应用于图片
- [x] 启用阴影和边框，阴影仅应用于边框
- [x] 阴影颜色和透明度正常工作
- [x] PC端和移动端阴影设置同步

#### 圆角功能

- [x] 统一圆角模式：调整滑块，四角同时变化
- [x] 独立设置模式：四个滑块分别控制四角
- [x] 模式切换：统一↔独立切换正常
- [x] 圆角与边框配合：内部圆角正确计算
- [x] PC端和移动端圆角设置同步

#### 移动端下拉选择器

- [x] 裁剪比例下拉选择器工作正常
- [x] 滤镜下拉选择器工作正常
- [x] 翻转下拉选择器工作正常
- [x] 旋转按钮响应点击
- [x] 所有选择器与PC端同步

#### 移动端高级功能

- [x] "高级"标签页显示
- [x] 四个快捷按钮显示且可点击
- [x] 点击按钮打开抽屉
- [x] 抽屉自动滚动到对应区域
- [x] 点击拖动条关闭抽屉
- [x] 点击遮罩层关闭抽屉
- [x] 抽屉打开时禁用背景滚动
- [x] 抽屉关闭时恢复背景滚动

#### JavaScript错误

- [x] 控制台无语法错误
- [x] 无重复声明警告
- [x] 所有按钮响应点击
- [x] 事件监听器正常工作

### 手动测试步骤

#### 测试环境

- **桌面浏览器**: Chrome, Firefox, Safari, Edge
- **移动设备**: iPhone, Android 手机
- **模拟器**: Chrome DevTools 移动模拟器

#### 测试步骤

1. **上传图片**
   - 打开工具
   - 上传测试图片
   - 验证图片正常显示

2. **测试阴影功能**（桌面）
   - 启用阴影
   - 调整模糊度到最大
   - 验证图片大小不变
   - 验证阴影显示正确

3. **测试圆角功能**（桌面）
   - 启用圆角
   - 切换到"独立设置"模式
   - 分别调整四个角
   - 验证每个角独立变化
   - 切换回"统一圆角"
   - 验证四角同步变化

4. **测试下拉选择器**（移动端）
   - 切换到移动视图
   - 测试裁剪比例选择
   - 测试滤镜选择
   - 测试翻转选择
   - 点击旋转按钮
   - 验证所有功能正常

5. **测试高级功能**（移动端）
   - 点击"高级"标签
   - 点击"💧 水印"按钮
   - 验证抽屉打开并滚动到水印区域
   - 测试水印设置
   - 关闭抽屉
   - 依次测试圆角、边框、阴影按钮

6. **测试PC/移动端同步**
   - 在桌面调整圆角
   - 切换到移动视图
   - 验证圆角值同步
   - 在移动端修改阴影
   - 切换回桌面
   - 验证阴影值同步

7. **检查控制台**
   - 打开浏览器开发者工具
   - 查看Console标签
   - 验证无JavaScript错误
   - 验证无警告信息

### 测试结果

✅ **所有测试通过**

- 阴影功能完全正常
- 圆角独立/统一模式工作正常
- 移动端下拉选择器功能完整
- 移动端高级功能完全可用
- 无JavaScript错误
- PC/移动端完美同步

### 测试页面

专用测试页面: [test-image-cropper-mobile-advanced.html](../test/test-image-cropper-mobile-advanced.html)

---

## 相关文件

### 修改的文件

| 文件 | 修改行数 | 说明 |
|------|----------|------|
| [tools/image-cropper/index.html](../../tools/image-cropper/index.html) | ~500行 | 主要修复文件 |

### 关键代码区域

| 功能 | 行号 | 说明 |
|------|------|------|
| PC圆角UI | 1897-1948 | 统一/独立模式切换 |
| 移动端圆角UI | 2376-2425 | 移动端对应UI |
| 移动端比例选择器 | 2203-2212 | 裁剪比例下拉 |
| 移动端滤镜选择器 | 2234-2241 | 滤镜下拉 |
| 移动端翻转选择器 | 2285-2293 | 翻转 + 旋转按钮 |
| 高级标签页 | 2047 | "高级"标签按钮 |
| 高级快捷按钮 | 2114-2122 | 水印/圆角/边框/阴影 |
| 状态对象 | 2510-2518 | borderRadius扩展 |
| 抽屉控制 | 2916-2948 | 打开/关闭函数 |
| 快捷按钮处理 | 2871-2913 | 点击事件监听 |
| PC事件监听 | 2704-2767 | 圆角控件监听 |
| 移动端事件监听 | 3176-3239 | 圆角控件监听 |
| renderImage() | 3357-3473 | 修复阴影问题 |
| roundRectPath() | 3497-3539 | 圆角路径函数 |
| resetImage() | 4401-4480 | 重置逻辑更新 |
| enableButtons() | 4665-4777 | 按钮启用逻辑 |

### 新增功能

| 功能 | 文件 | 说明 |
|------|------|------|
| 独立圆角设置 | index.html | 支持四角独立或统一 |
| 移动端下拉选择器 | index.html | 比例/滤镜/翻转选择 |
| 移动端高级功能 | index.html | 抽屉系统 + 快捷按钮 |
| 测试页面 | test-image-cropper-mobile-advanced.html | 专用测试页面 |

### 文档更新

| 文档 | 说明 |
|------|------|
| [本文档](./image-cropper-mobile-advanced-v1.0.1-20250117.md) | 修复说明文档 |
| [测试页面](../test/test-image-cropper-mobile-advanced.html) | 功能测试清单 |

---

## 版本历史

### v1.0.1 (2025-01-17)

**修复内容**:
1. ✅ 阴影模糊不再改变图片大小
2. ✅ 阴影模糊效果正常显示
3. ✅ 圆角支持统一/独立四角设置
4. ✅ 移动端添加下拉选择器（比例/滤镜/翻转）
5. ✅ 移动端添加高级功能入口
6. ✅ 修复JavaScript重复声明错误

**影响范围**:
- 🎯 核心渲染逻辑优化
- 📱 移动端功能完整性大幅提升
- 🔄 PC/移动端双向同步机制
- 🐛 代码质量和稳定性提升

---

**文档版本**: v1.0.1
**创建日期**: 2025-01-17
**最后更新**: 2025-01-17
**维护者**: Development Team

---

[返回文档中心](../README.md) | [查看功能文档](../features/image-cropper-v1.0.0.md) | [测试页面](../test/test-image-cropper-mobile-advanced.html)
