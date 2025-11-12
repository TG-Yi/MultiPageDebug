# 主题按钮拖拽功能说明 🖱️

## 📋 功能概述

主题设置按钮支持完整的拖拽功能,用户可以将按钮移动到屏幕的任意位置,提供更灵活的界面定制体验。

## ✨ 核心特性

### 1. 自由拖拽 🎯
- **鼠标拖拽**: 按住按钮并移动鼠标
- **触摸拖拽**: 触摸设备上支持手指拖动
- **实时跟随**: 按钮实时跟随鼠标/手指移动
- **平滑动画**: 拖拽过程流畅无卡顿

### 2. 智能吸附 🧲
- **边缘吸附**: 释放时自动吸附到最近的屏幕边缘
- **左右选择**: 自动判断靠左还是靠右
- **垂直限制**: 防止按钮超出屏幕上下边界
- **动画过渡**: 吸附过程带有平滑过渡动画

### 3. 位置记忆 💾
- **自动保存**: 拖拽结束后自动保存位置
- **持久化存储**: 使用localStorage保存配置
- **跨会话保持**: 刷新页面或重新访问时保持位置
- **存储键**: `theme_button_position`

### 4. 点击识别 🖱️
- **智能区分**: 自动区分点击和拖拽操作
- **距离阈值**: 移动距离小于5px视为点击
- **功能保留**: 点击仍可正常打开主题选择器
- **徽章点击**: 点击徽章不触发拖拽

## 🎨 视觉反馈

### 鼠标状态
- **默认**: `grab` 抓手图标
- **拖拽中**: `grabbing` 抓取图标
- **悬停**: 放大并旋转(非拖拽时)

### 拖拽状态
- **开始拖拽**: 添加 `.dragging` 类
- **拖拽中**: 轻微放大 + 增强阴影
- **结束拖拽**: 平滑过渡到最终位置

## 🔧 技术实现

### 核心函数

**位置管理**:
```javascript
function setButtonPosition(element, x, y)
// 设置按钮的绝对位置
```

**边缘吸附**:
```javascript
function snapToEdge(element)
// 计算并执行边缘吸附
// - 水平: 左侧20px 或 右侧20px
// - 垂直: 最小20px, 最大(窗口高度-按钮高度-20px)
```

**位置保存**:
```javascript
function saveButtonPosition(x, y)
// 保存到localStorage: { x, y }
```

**默认位置**:
```javascript
function setDefaultPosition()
// 首次加载时设置默认位置(右下角)
```

### 事件处理

**1. dragStart (mousedown / touchstart)**
- 记录初始位置
- 添加拖拽样式
- 设置拖拽标志

**2. drag (mousemove / touchmove)**
- 计算新位置
- 实时更新按钮位置
- 阻止默认行为

**3. dragEnd (mouseup / touchend)**
- 计算拖拽距离
- 判断是点击还是拖拽
- 执行边缘吸附
- 保存最终位置
- 恢复样式

### 位置数据结构

```json
{
  "x": 1200,
  "y": 650
}
```

- `x`: 距离视口左侧的像素距离
- `y`: 距离视口顶部的像素距离

## 📱 响应式适配

### 桌面端
- 鼠标拖拽流畅
- Hover效果正常
- 边缘吸附距离: 20px

### 移动端
- 触摸拖拽支持
- 禁用用户选择(`user-select: none`)
- 禁用触摸操作(`touch-action: none`)
- 防止页面滚动冲突

## 🎯 用户体验优化

### 1. 防误触
- 点击徽章不触发拖拽
- 小距离移动识别为点击
- 拖拽中禁用hover效果

### 2. 视觉引导
- 抓手光标提示可拖拽
- 拖拽中视觉反馈明显
- 吸附动画清晰自然

### 3. 位置智能
- 首次使用默认右下角
- 边缘吸附避免遮挡
- 垂直位置不超出视口

## 🔒 边界限制

### 水平边界
```javascript
if (rect.left < windowWidth / 2) {
  newX = 20;  // 靠左吸附
} else {
  newX = windowWidth - rect.width - 20;  // 靠右吸附
}
```

### 垂直边界
```javascript
if (rect.top < 20) {
  newY = 20;  // 顶部限制
} else if (rect.bottom > windowHeight - 20) {
  newY = windowHeight - rect.height - 20;  // 底部限制
}
```

## 📊 性能考虑

- ✅ 使用CSS `transform` 避免重排
- ✅ 拖拽时禁用过渡动画
- ✅ 事件委托到document
- ✅ 最小化DOM操作
- ✅ 防抖保存到localStorage

## 🐛 已知限制

1. **窗口resize**: 当前未监听窗口大小变化,可能导致按钮超出视口
2. **多屏幕**: 跨屏幕移动窗口时位置可能不准确
3. **高分屏**: DPR > 1时位置计算可能有微小偏差

## 🚀 未来增强

- [ ] 监听窗口resize事件,自动调整位置
- [ ] 支持双击重置到默认位置
- [ ] 添加位置历史记录
- [ ] 支持键盘快捷键移动
- [ ] 提供预设位置快速切换

## 📝 代码位置

**主要文件**: `toolbox/shared/scripts/theme.js`

**核心函数**: `initThemeButtonDrag()` (行1546-1708)

**相关CSS**: `toolbox/index.html` (行62-96)

**HTML元素**: `#theme-toggle-btn`

## 🎓 使用示例

### 基本使用
1. 打开工具箱页面
2. 找到右下角的 🎨 按钮
3. 按住按钮并拖动
4. 释放到想要的位置
5. 按钮自动吸附到边缘

### 重置位置
1. 清除localStorage: `localStorage.removeItem('theme_button_position')`
2. 刷新页面
3. 按钮恢复到默认位置(右下角)

### 调试模式
```javascript
// 在控制台查看当前位置
JSON.parse(localStorage.getItem('theme_button_position'))

// 手动设置位置
localStorage.setItem('theme_button_position', JSON.stringify({x: 100, y: 100}))
location.reload()
```

---

**开发日期**: 2025-01-12
**版本**: v1.2.0
**状态**: ✅ 已完成
