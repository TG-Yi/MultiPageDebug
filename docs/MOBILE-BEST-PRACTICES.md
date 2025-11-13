# 移动端开发最佳实践

> 基于海报设计工具移动端优化总结的通用指南

## 📋 目录

- [触摸事件处理](#触摸事件处理)
- [UI 组件规范](#ui-组件规范)
- [布局设计](#布局设计)
- [性能优化](#性能优化)
- [调试技巧](#调试技巧)

---

## 🖐️ 触摸事件处理

### 1. 双事件绑定模式

移动端应同时绑定 `click` 和 `touchstart` 事件：

```javascript
// ✅ 推荐做法
const handleAction = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // 处理逻辑
};

button.addEventListener('click', handleAction);
button.addEventListener('touchstart', handleAction, { passive: false });
```

```javascript
// ❌ 不推荐（仅 click）
button.addEventListener('click', handleAction);
```

### 2. 事件处理要点

**必须要做**：
- ✅ `preventDefault()` - 防止默认行为（如双击缩放、长按菜单）
- ✅ `stopPropagation()` - 防止事件冒泡
- ✅ `passive: false` - 允许调用 preventDefault

**CSS 配合**：
```css
.touchable-element {
  -webkit-tap-highlight-color: transparent; /* 去除点击高亮 */
  touch-action: manipulation; /* 禁用双击缩放 */
  user-select: none; /* 防止文本选择 */
  -webkit-user-select: none;
}
```

### 3. 常见问题解决

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 按钮点击无响应 | 只绑定了 click 事件 | 添加 touchstart 事件 |
| 点击有 300ms 延迟 | 浏览器默认行为 | 使用 touchstart 或 touch-action |
| 误触发双击缩放 | 未禁用默认行为 | preventDefault + touch-action |
| 点击穿透 | z-index 或 pointer-events 问题 | 检查层级和事件配置 |

---

## 🎨 UI 组件规范

### 1. 触摸目标尺寸

**Apple HIG 标准**：44×44pt
**Material Design 标准**：48×48dp
**推荐**：44×44px（统一）

```css
.mobile-button {
  min-width: 44px;
  min-height: 44px;
  /* 或使用 padding 确保 */
  padding: 12px 16px; /* 内容 + padding ≥ 44px */
}
```

### 2. 按钮设计

**FAB（浮动操作按钮）**：
```css
.fab-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  /* 触摸反馈 */
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-btn:active {
  transform: scale(0.92);
}
```

**工具按钮**：
```css
.tool-btn {
  padding: 14px 18px;
  min-height: 44px;
  border-radius: 12px;

  /* 文字左对齐（列表式） */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}
```

### 3. 输入框设计

```css
.mobile-input {
  padding: 12px;
  font-size: 15px; /* 防止 iOS 自动缩放（最小 16px） */
  min-height: 44px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.mobile-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  outline: none;
}
```

**特殊输入框**：
```css
/* 数字输入框 - 隐藏上下箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* 下拉框 - 自定义箭头 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-position: right 12px center;
  padding-right: 36px;
}
```

---

## 📐 布局设计

### 1. 抽屉式菜单

**基本结构**：
```html
<!-- 遮罩层 -->
<div class="drawer-overlay"></div>

<!-- 抽屉面板 -->
<div class="drawer">
  <div class="drawer-header">
    <div class="drawer-title">标题</div>
    <button class="drawer-close">×</button>
  </div>
  <div class="drawer-content">
    <!-- 内容 -->
  </div>
</div>
```

**样式**：
```css
/* 遮罩层 */
.drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s;
}

.drawer-overlay.active {
  display: block;
  opacity: 1;
}

/* 抽屉 */
.drawer {
  display: none;
  position: fixed;
  top: 0;
  right: 0; /* 从右侧滑入 */
  height: 100vh;
  width: 85%;
  max-width: 360px;
  background: white;
  z-index: 10001;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.drawer.active {
  display: block;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* 禁止页面滚动 */
body.drawer-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}
```

### 2. z-index 层级管理

**推荐层级体系**：
```css
/* 基础层 */
.content { z-index: 1; }
.sticky-header { z-index: 10; }
.floating-button { z-index: 100; }

/* 覆盖层 */
.modal-overlay { z-index: 1000; }
.modal-content { z-index: 1001; }

/* 顶层（需要覆盖全局元素时） */
.drawer-overlay { z-index: 10000; }
.drawer { z-index: 10001; }
.toast { z-index: 10002; }
```

**关键点**：
- 遮罩层必须高于所有常规元素（如返回首页按钮）
- 抽屉面板必须高于遮罩层
- 预留足够的层级间隔（×10 或 ×100）

### 3. 间距系统

**8px 基准**：
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  --spacing-4xl: 40px;
}
```

**应用**：
- 小间距（4-8px）：图标和文字、列表项之间
- 中间距（12-16px）：输入框、卡片内部
- 大间距（20-24px）：章节、卡片之间
- 特大间距（32-40px）：页面顶部/底部留白

---

## ⚡ 性能优化

### 1. CSS 动画优化

**使用 GPU 加速属性**：
```css
/* ✅ 推荐 - 使用 transform */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ 避免 - 触发重排 */
.animated {
  left: 100px;
  width: 200px;
}
```

**will-change 提示**：
```css
.drawer {
  will-change: transform; /* 提前告知浏览器 */
}

.drawer.animating {
  transform: translateX(0);
}
```

### 2. 触摸滚动优化

```css
.scrollable {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

/* 自定义滚动条 */
.scrollable::-webkit-scrollbar {
  width: 4px;
}

.scrollable::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
```

### 3. 事件处理优化

**事件委托**：
```javascript
// ✅ 推荐 - 事件委托
layerList.addEventListener('click', (e) => {
  const item = e.target.closest('.layer-item');
  if (item) handleLayerClick(item);
});

// ❌ 避免 - 为每个元素绑定
layers.forEach(layer => {
  layer.addEventListener('click', handleLayerClick);
});
```

**防抖和节流**：
```javascript
// 防抖 - 输入框
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

input.addEventListener('input', debounce(handleInput, 300));

// 节流 - 滚动事件
const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
};

scrollable.addEventListener('scroll', throttle(handleScroll, 100));
```

---

## 🐛 调试技巧

### 1. 详细日志系统

**使用 emoji 前缀**：
```javascript
console.log('🚀 应用启动');
console.log('📱 移动端检测:', isMobile);
console.log('🛠️ 工具按钮被点击');
console.log('✅ 初始化成功');
console.log('❌ 错误:', error);
console.log('⚠️ 警告:', warning);
```

**结构化日志**：
```javascript
console.log('📊 元素状态:', {
  id: element.id,
  className: element.className,
  rect: element.getBoundingClientRect(),
  computedStyle: {
    display: getComputedStyle(element).display,
    zIndex: getComputedStyle(element).zIndex,
    pointerEvents: getComputedStyle(element).pointerEvents
  }
});
```

### 2. 全局事件监听

**诊断事件问题**：
```javascript
// 捕获阶段监听所有点击
document.addEventListener('click', (e) => {
  console.log('🖱️ 点击事件:', {
    target: e.target,
    tagName: e.target.tagName,
    id: e.target.id,
    className: e.target.className,
    position: { x: e.clientX, y: e.clientY }
  });
}, true); // 使用捕获阶段

// 同时监听触摸事件
document.addEventListener('touchstart', (e) => {
  console.log('👆 触摸事件:', {
    target: e.target,
    touches: e.touches.length,
    position: {
      x: e.touches[0]?.clientX,
      y: e.touches[0]?.clientY
    }
  });
}, true);
```

### 3. 移动端调试工具

**Chrome DevTools**：
1. 打开开发者工具（F12）
2. 点击设备工具栏图标（Ctrl+Shift+M）
3. 选择设备型号或自定义尺寸
4. 启用触摸模拟

**远程调试**：
- iOS: Safari Web Inspector
- Android: Chrome Remote Debugging
- 微信: 微信开发者工具

**vconsole（移动端控制台）**：
```html
<script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script>
<script>
  new VConsole();
</script>
```

---

## 📋 检查清单

### 功能检查

- [ ] 所有按钮同时支持 click 和 touchstart
- [ ] 触摸目标尺寸 ≥ 44×44px
- [ ] 输入框字体 ≥ 15px（避免 iOS 缩放）
- [ ] 按钮有明显的按下反馈（transform scale）
- [ ] 抽屉打开时页面不可滚动
- [ ] 遮罩层 z-index 足够高
- [ ] 滚动容器平滑滚动
- [ ] 去除触摸高亮
- [ ] 禁用不必要的手势（双击缩放等）

### 性能检查

- [ ] 动画使用 transform 和 opacity
- [ ] 事件使用委托或节流
- [ ] 避免频繁 DOM 操作
- [ ] 图片懒加载
- [ ] CSS 选择器简单高效

### 兼容性检查

- [ ] iOS Safari（不同版本）
- [ ] Android Chrome
- [ ] 微信内置浏览器
- [ ] 其他常见移动浏览器
- [ ] 横屏/竖屏切换

---

## 🎯 总结

### 核心原则

1. **触摸优先**：所有交互必须考虑触摸操作
2. **尺寸足够**：触摸目标最小 44px
3. **反馈明显**：视觉和触觉反馈清晰
4. **性能优先**：流畅度 > 功能复杂度
5. **兼容性好**：主流移动浏览器全支持

### 常见错误

❌ 只绑定 click 事件
❌ 按钮太小（< 44px）
❌ 没有按下反馈
❌ 动画卡顿（使用 left/top 而非 transform）
❌ 忘记禁用默认行为（双击缩放、长按菜单）
❌ z-index 层级混乱
❌ 输入框字体太小（< 15px）

### 最佳实践

✅ click + touchstart 双事件绑定
✅ 最小触摸目标 44×44px
✅ transform + opacity 做动画
✅ preventDefault + stopPropagation
✅ 清晰的 z-index 层级体系
✅ 合理的间距系统（8px 基准）
✅ 详细的日志系统
✅ 完整的调试工具

---

## 📚 参考资源

**官方指南**：
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

**工具**：
- Chrome DevTools
- Safari Web Inspector
- vConsole

**相关文档**：
- [海报设计工具移动端优化](./features/poster-designer-mobile-optimization.md)
- 项目 README

---

> **最后更新**：2025-01-13
> **维护者**：开发团队
