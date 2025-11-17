#!/bin/bash

# 文档位置检查脚本
# 用于验证所有文档是否放在正确的位置

echo "📋 检查文档位置..."
echo "=================="
echo ""

# 检查项目根目录是否有文档(除README外)
echo "1. 检查根目录..."
ROOT_DOCS=$(find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CHANGELOG.md" 2>/dev/null | wc -l)
if [ "$ROOT_DOCS" -gt 0 ]; then
    echo "❌ 根目录发现 $ROOT_DOCS 个文档文件:"
    find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CHANGELOG.md"
    echo "   建议: 移动到 docs/ 目录"
else
    echo "✅ 根目录干净"
fi
echo ""

# 检查工具目录是否有文档
echo "2. 检查工具目录..."
TOOL_DOCS=$(find tools/ -name "*.md" 2>/dev/null | wc -l)
if [ "$TOOL_DOCS" -gt 0 ]; then
    echo "❌ 工具目录发现 $TOOL_DOCS 个文档文件:"
    find tools/ -name "*.md"
    echo "   建议: 移动到 docs/tools/{tool-name}/ 目录"
else
    echo "✅ 工具目录干净"
fi
echo ""

# 检查测试文件位置
echo "3. 检查测试文件..."
ROOT_TESTS=$(find . -maxdepth 1 -name "test-*.html" 2>/dev/null | wc -l)
if [ "$ROOT_TESTS" -gt 0 ]; then
    echo "❌ 根目录发现 $ROOT_TESTS 个测试文件:"
    find . -maxdepth 1 -name "test-*.html"
    echo "   建议: 移动到 docs/test/ 目录"
else
    echo "✅ 测试文件位置正确"
fi
echo ""

# 检查shared目录是否有文档
echo "4. 检查shared目录..."
SHARED_DOCS=$(find shared/ -name "*.md" 2>/dev/null | wc -l)
if [ "$SHARED_DOCS" -gt 0 ]; then
    echo "❌ shared目录发现 $SHARED_DOCS 个文档文件:"
    find shared/ -name "*.md"
    echo "   建议: 移动到 docs/implementation/ 或 docs/features/ 目录"
else
    echo "✅ shared目录干净"
fi
echo ""

# 统计docs目录文档数量
echo "5. 文档统计..."
TOTAL_DOCS=$(find docs/ -name "*.md" 2>/dev/null | wc -l)
TEST_PAGES=$(find docs/test/ -name "*.html" 2>/dev/null | wc -l)
echo "✅ docs/ 目录下共有 $TOTAL_DOCS 个文档"
echo "✅ docs/test/ 目录下共有 $TEST_PAGES 个测试页面"
echo ""

# 检查.claude目录规则文件
echo "6. 检查AI规则文件..."
if [ -f ".claude/documentation-rules.md" ]; then
    echo "✅ AI规则文件存在: .claude/documentation-rules.md"
else
    echo "❌ AI规则文件缺失: .claude/documentation-rules.md"
fi

if [ -f ".claude/prompts/documentation.md" ]; then
    echo "✅ AI提示文件存在: .claude/prompts/documentation.md"
else
    echo "❌ AI提示文件缺失: .claude/prompts/documentation.md"
fi
echo ""

# 总结
echo "=================="
echo "✅ 检查完成!"
echo ""

ERRORS=$((ROOT_DOCS + TOOL_DOCS + ROOT_TESTS + SHARED_DOCS))
if [ "$ERRORS" -eq 0 ]; then
    echo "🎉 所有文档位置正确!"
else
    echo "⚠️  发现 $ERRORS 个需要整理的文件"
    echo "📖 请参考: docs/DOCUMENTATION-GUIDE.md"
fi
