# 移动端主题按钮显示修复 📱

## 🐛 问题描述

移动端(屏幕宽度 ≤ 768px)上主题按钮(🎨)不显示或显示位置不正确。

## 🔍 根本原因

拖拽功能通过 JavaScript 设置 inline style(`left` 和 `top`),这些样式会覆盖 CSS 的 `bottom` 和 `right` 定位。在移动端,保存的位置或默认计算的位置可能超出屏幕范围。

## ✅ 解决方案

### 1. CSS 层面强制重置 (index.html)

```css
@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 50px;
    height: 50px;
    font-size: 24px;
    bottom: 20px !important;
    right: 20px !important;
  }

  /* 覆盖 JavaScript 设置的 inline style */
  .theme-toggle-btn[style*="left"] {
    left: auto !important;
    right: 20px !important;
  }

  .theme-toggle-btn[style*="top"] {
    top: auto !important;
    bottom: 20px !important;
  }
}
```

### 2. JavaScript 层面处理 (theme.js)

#### 修改 `setDefaultPosition()`:
```javascript
function setDefaultPosition() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isMobile = windowWidth <= 768;

  if (isMobile) {
    // 移动端:固定在右下角
    xOffset = windowWidth - 70; // 50px按钮 + 20px边距
    yOffset = windowHeight - 70;
  } else {
    // 桌面端:稍大的边距
    xOffset = windowWidth - 90; // 60px按钮 + 30px边距
    yOffset = windowHeight - 90;
  }
  setButtonPosition(btn, xOffset, yOffset);
}
```

#### 新增 `checkMobilePosition()`:
```javascript
function checkMobilePosition() {
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 768;

  if (isMobile) {
    // 移动端:清除 inline 样式,使用 CSS
    btn.style.cssText = '';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
  }
}
```

#### 禁用移动端鼠标拖拽:
```javascript
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
  btn.addEventListener("mousedown", dragStart);
}
// 触摸事件保留,用于点击检测
btn.addEventListener("touchstart", dragStart);
```

#### 修改 `drag()` - 禁用移动端视觉拖拽:
```javascript
function drag(e) {
  if (!isDragging) return;
  e.preventDefault();

  // 移动端禁用拖拽视觉反馈,保持固定位置
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    // 移动端只跟踪位置用于计算拖拽距离,不实际移动按钮
    return;
  }

  // 桌面端正常拖拽...
}
```

#### 修改 `dragEnd()`:
```javascript
function dragEnd(e) {
  // ... 现有代码 ...

  const windowWidth = window.innerWidth;
  const isMobileNow = windowWidth <= 768;

  if (isMobileNow) {
    // 移动端:拖拽后重置为固定位置
    btn.style.cssText = '';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
  } else {
    // 桌面端:边界吸附和保存位置
    snapToEdge(btn);
    saveButtonPosition(xOffset, yOffset);
  }

  // ... 点击检测代码 ...
}
```

#### 监听窗口大小变化:
```javascript
window.addEventListener('resize', checkMobilePosition);
```

## 📊 行为说明

### 桌面端 (> 768px)
- ✅ 支持拖拽
- ✅ 边缘自动吸附
- ✅ 位置持久化
- ✅ 点击打开主题选择器

### 移动端 (≤ 768px)
- ✅ **固定位置**: 始终在右下角 20px
- ✅ **点击可用**: 点击打开主题选择器
- ❌ **禁用拖拽**: 移动端不支持鼠标拖拽
- ✅ **无视觉移动**: 触摸时按钮保持固定,不会跟随手指移动
- ✅ **按钮可见**: 修复了拖拽时按钮隐藏的问题

## 🎯 测试验证

### 测试步骤:

1. **移动端测试**:
   ```
   - 在浏览器中打开 index.html
   - 将浏览器窗口缩小到 ≤ 768px
   - 刷新页面
   - 验证: 按钮显示在右下角
   - 点击按钮: 主题选择器打开
   ```

2. **响应式测试**:
   ```
   - 从桌面端(>768px)开始
   - 拖拽按钮到不同位置
   - 缩小窗口到移动端(≤768px)
   - 验证: 按钮自动回到右下角
   - 放大窗口到桌面端
   - 验证: 按钮恢复到拖拽位置
   ```

3. **触摸设备测试**:
   ```
   - 使用真实移动设备或模拟器
   - 打开 index.html
   - 验证: 按钮显示在右下角
   - 点击按钮: 主题选择器打开
   ```

4. **按钮可见性测试** (v1.3.2新增):
   ```
   - 移动端打开 index.html
   - 尝试触摸拖拽主题按钮
   - 验证: 按钮保持在原位,不会隐藏或移动
   - 释放后点击按钮: 主题选择器正常打开
   ```

## 🔧 修改的文件

1. **[toolbox/index.html](toolbox/index.html:129-148)**
   - 添加移动端 CSS 强制定位规则

2. **[toolbox/shared/scripts/theme.js](toolbox/shared/scripts/theme.js:1991-2150)**
   - 修改 `setDefaultPosition()`
   - 新增 `checkMobilePosition()`
   - 修改事件监听器逻辑
   - 修改 `drag()` 函数 - 禁用移动端视觉拖拽 (v1.3.2)
   - 修改 `dragEnd()` 函数

## 📝 版本历史

### v1.3.2 (2025-01-12)
- 🐛 修复移动端按钮拖拽时隐藏的问题
- ✅ 禁用移动端拖拽视觉反馈
- ✅ 按钮在移动端始终可见
- ✅ 保持点击功能正常

### v1.3.1 (2025-01-12)
- 🐛 修复移动端主题按钮不显示的问题
- ✅ 移动端固定按钮位置
- ✅ 添加窗口resize监听
- ✅ 优化移动端用户体验

---

**最新修复日期**: 2025-01-12
**影响版本**: v1.3.1
**修复版本**: v1.3.2
**状态**: ✅ 已修复并测试
