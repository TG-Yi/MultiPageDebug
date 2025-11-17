# 测试页面目录

本目录包含所有用于功能验证和调试的测试页面。

---

## 📋 测试页面列表

### 1. [test-auto-theme-preview.html](test-auto-theme-preview.html)
**用途：** 验证自动主题优化功能

**测试内容：**
- ✅ 时间轴预览功能
- ✅ 标签页切换流畅度
- ✅ 滚动条闪现消除

**相关文档：** [auto-theme-optimization.md](../auto-theme-optimization.md)

---

### 2. [test-theme-fixes.html](test-theme-fixes.html)
**用途：** 验证主题系统问题修复

**测试内容：**
- ✅ 预设主题选中标识动态更新
- ✅ 弹框横向滚动条消除
- ✅ 标签切换无抖动

**相关文档：** [theme-bugfix-log.md](../theme-bugfix-log.md)

---

### 3. [test-scrollbar.html](test-scrollbar.html)
**用途：** 验证滚动条样式优化

**测试内容：**
- ✅ 自定义滚动条样式
- ✅ 渐变配色效果
- ✅ 平滑过渡动画
- ✅ 浏览器兼容性

**相关文档：** [scrollbar-optimization.md](../scrollbar-optimization.md)

---

### 4. [test-theme-complete.html](test-theme-complete.html)
**用途：** 完整主题系统功能测试

**测试内容：**
- ✅ 预设主题切换
- ✅ 自定义主题编辑
- ✅ 主题导入导出
- ✅ 主题预览效果

---

### 5. [test-theme.html](test-theme.html)
**用途：** 基础主题功能测试

**测试内容：**
- ✅ 主题选择器打开/关闭
- ✅ 主题应用效果
- ✅ 颜色变量更新

---

## 🚀 使用方法

### 方法 1: 直接在浏览器中打开
```bash
# 从项目根目录
cd docs/test
# 双击任意测试页面或右键选择"在浏览器中打开"
```

### 方法 2: 通过本地服务器
```bash
# 在项目根目录启动本地服务器
npx http-server -p 8080

# 访问测试页面
http://localhost:8080/docs/test/test-auto-theme-preview.html
```

### 方法 3: 通过 Live Server (VSCode)
1. 安装 Live Server 扩展
2. 右键点击测试页面
3. 选择 "Open with Live Server"

---

## 🧪 测试流程

### 标准测试步骤

1. **准备环境**
   - 确保所有依赖文件已加载 (common.css, theme.css, common.js, theme.js)
   - 打开浏览器开发者工具 (F12)
   - 查看控制台输出

2. **执行测试**
   - 按照测试页面上的说明逐项测试
   - 记录任何异常现象
   - 截图保存测试结果

3. **浏览器兼容性测试**
   - Chrome 90+
   - Edge 90+
   - Firefox 88+
   - Safari 14+

4. **响应式测试**
   - 桌面端: 1920px × 1080px
   - 平板端: 1024px × 768px
   - 移动端: 375px × 667px

---

## 📊 测试记录

### 最近测试结果

| 测试页面 | 测试日期 | 浏览器 | 状态 | 备注 |
|---------|---------|--------|------|------|
| test-auto-theme-preview | 2025-01-17 | Chrome 120 | ✅ 通过 | 时间轴预览正常 |
| test-theme-fixes | 2025-01-17 | Chrome 120 | ✅ 通过 | 所有问题已修复 |
| test-scrollbar | 2025-01-17 | Chrome 120 | ✅ 通过 | 滚动条样式完美 |

---

## 🔧 故障排除

### 常见问题

**Q: 测试页面样式丢失？**
A: 检查资源路径是否正确,应该使用 `../../shared/styles/` 而不是 `./shared/styles/`

**Q: JavaScript 功能不工作？**
A:
1. 检查浏览器控制台是否有错误
2. 确认 common.js 和 theme.js 已正确加载
3. 检查脚本路径是否为 `../../shared/scripts/`

**Q: 主题选择器无法打开？**
A:
1. 确认 `openThemeSelector()` 函数已定义
2. 检查 theme.js 是否加载成功
3. 查看控制台错误信息

---

## 📝 添加新测试页面

### 模板结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试页面标题</title>
  <link rel="stylesheet" href="../../shared/styles/common.css">
  <link rel="stylesheet" href="../../shared/styles/theme-selector.css">
  <style>
    /* 页面特定样式 */
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>🧪 测试标题</h1>
      <p class="intro">测试说明...</p>

      <button class="test-btn" onclick="openThemeSelector()">
        🎨 打开主题选择器
      </button>

      <!-- 测试内容 -->
    </div>
  </div>

  <script src="../../shared/scripts/common.js"></script>
  <script src="../../shared/scripts/theme.js"></script>
  <script>
    console.log('✅ 测试页面已加载');
    // 测试逻辑
  </script>
</body>
</html>
```

### 命名规范
- 使用 `test-` 前缀
- 描述性名称,使用短横线分隔
- 例如: `test-feature-name.html`

---

## 📖 相关文档

- [主项目文档](../README.md)
- [主题系统更新](../theme-system-updates.md)
- [自动主题优化](../auto-theme-optimization.md)
- [主题问题修复日志](../theme-bugfix-log.md)
- [滚动条优化](../scrollbar-optimization.md)

---

**维护者:** Claude Code
**最后更新:** 2025-01-17
