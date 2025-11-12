# 文档迁移指南 📦

## 📅 迁移信息

- **迁移日期**: 2025-01-12
- **迁移版本**: v1.3.2 → v1.4.0 (文档重组)
- **负责人**: Development Team

## 🎯 迁移目的

为了更好地组织和维护项目文档,我们将所有文档从根目录迁移到 `docs/` 目录,并按类型进行分类管理。

## 📁 目录结构变更

### 迁移前 (v1.3.2)

```
toolbox/
├── README.md
├── DESIGN.md
├── AUTO_THEME_FEATURES.md
├── DRAG_FEATURE.md
├── CUSTOM_SCHEDULE_FEATURE.md
├── IMPLEMENTATION_SUMMARY.md
├── MOBILE_FIX.md
├── MOBILE_DRAG_FIX_TEST.md
├── v1.3.2-RELEASE-NOTES.md
└── ...
```

### 迁移后 (v1.4.0)

```
toolbox/
├── README.md                    # 保留在根目录
├── docs/                        # 新增文档中心
│   ├── README.md               # 文档索引
│   ├── features/               # 功能文档
│   │   ├── auto-theme-v1.1.0.md
│   │   ├── drag-button-v1.2.0.md
│   │   └── custom-schedule-v1.3.0.md
│   ├── fixes/                  # 修复文档
│   │   └── mobile-button-v1.3.1-v1.3.2-20250112.md
│   ├── releases/               # 发布文档
│   │   └── v1.3.2-20250112.md
│   ├── testing/                # 测试文档
│   │   └── mobile-drag-test-v1.3.2.md
│   ├── implementation/         # 实现文档
│   │   └── custom-schedule-v1.3.0.md
│   └── design/                 # 设计文档
│       └── ui-design.md
└── ...
```

## 🔄 文件映射表

### 功能文档 (features/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `AUTO_THEME_FEATURES.md` | `docs/features/auto-theme-v1.1.0.md` | 添加版本号 |
| `DRAG_FEATURE.md` | `docs/features/drag-button-v1.2.0.md` | 添加版本号 |
| `CUSTOM_SCHEDULE_FEATURE.md` | `docs/features/custom-schedule-v1.3.0.md` | 添加版本号 |

### 修复文档 (fixes/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `MOBILE_FIX.md` | `docs/fixes/mobile-button-v1.3.1-v1.3.2-20250112.md` | 添加版本和日期 |

### 发布文档 (releases/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `v1.3.2-RELEASE-NOTES.md` | `docs/releases/v1.3.2-20250112.md` | 添加日期 |

### 测试文档 (testing/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `MOBILE_DRAG_FIX_TEST.md` | `docs/testing/mobile-drag-test-v1.3.2.md` | 重命名 |

### 实现文档 (implementation/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `IMPLEMENTATION_SUMMARY.md` | `docs/implementation/custom-schedule-v1.3.0.md` | 添加具体功能名 |

### 设计文档 (design/)

| 旧路径 | 新路径 | 说明 |
|--------|--------|------|
| `DESIGN.md` | `docs/design/ui-design.md` | 更明确的命名 |

## 🔗 链接更新

### 主 README.md 更新

**旧链接**:
```markdown
[CUSTOM_SCHEDULE_FEATURE.md](./CUSTOM_SCHEDULE_FEATURE.md)
```

**新链接**:
```markdown
[自定义时间方案功能文档](./docs/features/custom-schedule-v1.3.0.md)
```

### 新增文档中心入口

在主 README.md 中新增:
```markdown
## 📚 文档中心

- 📖 **[功能文档](./docs/features/)**
- 🐛 **[修复文档](./docs/fixes/)**
- 📦 **[版本发布](./docs/releases/)**
- ...

👉 [查看文档中心索引](./docs/README.md)
```

## 📋 迁移检查清单

### ✅ 已完成

- [x] 创建 `docs/` 目录结构
- [x] 创建所有子目录 (features, fixes, releases, testing, implementation, design)
- [x] 移动所有文档文件到对应目录
- [x] 重命名文件符合命名规范
- [x] 创建 `docs/README.md` 文档索引
- [x] 更新主 `README.md` 中的链接
- [x] 添加文档中心入口
- [x] 验证所有文件路径正确

### ⏳ 后续任务

- [ ] 更新其他可能引用旧路径的文件
- [ ] 通知团队成员文档位置变更
- [ ] 更新CI/CD配置(如果涉及文档路径)
- [ ] 添加文档版本控制规范

## 📝 命名规范说明

### 功能文档
- **格式**: `{功能名}-v{版本}.md`
- **示例**: `auto-theme-v1.1.0.md`
- **说明**: 使用kebab-case,包含引入版本号

### 修复文档
- **格式**: `{问题简述}-v{版本范围}-{日期}.md`
- **示例**: `mobile-button-v1.3.1-v1.3.2-20250112.md`
- **说明**: 包含修复的版本范围和日期(YYYYMMDD)

### 发布文档
- **格式**: `v{版本}-{日期}.md`
- **示例**: `v1.3.2-20250112.md`
- **说明**: 版本号+发布日期

### 其他文档
- **格式**: `{描述性名称}.md`
- **示例**: `ui-design.md`, `theme-api.md`
- **说明**: 清晰描述文档内容

## 🎯 迁移优势

### 1. 更清晰的组织结构
- 按文档类型分类,易于查找
- 根目录保持简洁
- 便于扩展新类型文档

### 2. 更好的版本管理
- 文件名包含版本信息
- 方便追溯历史变更
- 支持多版本文档并存

### 3. 更专业的项目形象
- 符合业界标准
- 便于团队协作
- 提升可维护性

### 4. 更完善的文档索引
- 中心化的文档入口
- 分类目录清晰
- 快速定位所需文档

## 🔍 如何适应变更

### 对于开发者

1. **查找文档**: 访问 [docs/README.md](./README.md) 查看文档索引
2. **添加文档**: 按照命名规范在对应目录创建
3. **更新文档**: 直接编辑对应文件
4. **引用文档**: 使用相对路径 `./docs/{category}/{filename}.md`

### 对于用户

1. **主文档不变**: [README.md](../README.md) 仍在根目录
2. **文档中心**: 点击文档中心链接访问所有文档
3. **分类浏览**: 按功能、版本、类型浏览文档

## 📊 迁移影响分析

### 文件系统

- **移动文件数**: 8个
- **新增文件**: 2个 (docs/README.md, MIGRATION-GUIDE.md)
- **删除文件**: 0个
- **总文件数变化**: +2

### 链接影响

- **断链风险**: 低(已更新所有主要链接)
- **需更新链接**: 1处 (README.md)
- **新增链接**: 7处 (文档中心导航)

### 工作流影响

- **开发流程**: 无影响
- **文档维护**: 更规范
- **CI/CD**: 无影响(仅文档迁移)

## ⚠️ 注意事项

1. **旧链接**: 旧的文档路径已失效,请使用新路径
2. **书签**: 如有收藏旧文档链接,请更新书签
3. **脚本**: 检查是否有脚本引用旧文档路径
4. **外部引用**: 更新外部文档中的链接(如wiki)

## 🆘 问题反馈

如果在迁移后遇到问题:

1. 检查 [文档索引](./README.md) 查找新路径
2. 使用文件名搜索定位文档
3. 提交Issue说明问题
4. 联系维护团队

## 📚 相关资源

- [文档中心](./README.md)
- [文档命名规范](./README.md#文档命名规范)
- [文档维护指南](./README.md#文档维护指南)
- [项目主页](../README.md)

---

**迁移完成日期**: 2025-01-12
**迁移负责人**: Development Team
**迁移状态**: ✅ 完成
**影响版本**: v1.4.0
