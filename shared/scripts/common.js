// 工具箱公共脚本

/**
 * 加载工具配置
 * 自动检测当前页面位置，使用正确的相对路径
 */
async function loadToolsConfig() {
  try {
    // 检测当前路径，判断配置文件的相对位置
    const currentPath = window.location.pathname;
    let configPath = "./config/tools.json";

    // 如果在子工具页面中（如 tools/xxx/index.html），使用 ../../config/tools.json
    if (currentPath.includes("/tools/")) {
      configPath = "../../config/tools.json";
    }

    const response = await fetch(configPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载工具配置失败:", error);
    return null;
  }
}

/**
 * 本地存储管理
 */
const Storage = {
  // 获取收藏的工具
  getFavorites() {
    const favorites = localStorage.getItem("toolbox_favorites");
    return favorites ? JSON.parse(favorites) : [];
  },

  // 添加收藏
  addFavorite(toolId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(toolId)) {
      favorites.push(toolId);
      localStorage.setItem("toolbox_favorites", JSON.stringify(favorites));
    }
  },

  // 移除收藏
  removeFavorite(toolId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(toolId);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem("toolbox_favorites", JSON.stringify(favorites));
    }
  },

  // 获取最近使用
  getRecentTools() {
    const recent = localStorage.getItem("toolbox_recent");
    return recent ? JSON.parse(recent) : [];
  },

  // 添加最近使用
  addRecentTool(toolId) {
    let recent = this.getRecentTools();
    // 移除已存在的
    recent = recent.filter((id) => id !== toolId);
    // 添加到开头
    recent.unshift(toolId);
    // 只保留最近10个
    recent = recent.slice(0, 10);
    localStorage.setItem("toolbox_recent", JSON.stringify(recent));
  },

  // 获取主题设置
  getTheme() {
    return localStorage.getItem("toolbox_theme") || "light";
  },

  // 设置主题
  setTheme(theme) {
    localStorage.setItem("toolbox_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  },
};

/**
 * 工具导航
 */
const Navigation = {
  // 跳转到工具页面
  toTool(toolPath) {
    window.location.href = toolPath;
  },

  // 返回首页
  toHome() {
    // 获取当前路径相对于toolbox的层级
    const pathParts = window.location.pathname.split("/");
    const toolboxIndex = pathParts.findIndex((part) => part === "toolbox");
    if (toolboxIndex !== -1) {
      const depth = pathParts.length - toolboxIndex - 1;
      const relativePath = "../".repeat(depth) + "index.html";
      window.location.href = relativePath;
    } else {
      window.location.href = "../../index.html";
    }
  },

  // 记录工具访问
  recordToolVisit(toolId) {
    Storage.addRecentTool(toolId);
  },
};

/**
 * 工具函数
 */
const Utils = {
  // 防抖
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 节流
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 复制到剪贴板
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        return success;
      }
    } catch (error) {
      console.error("复制失败:", error);
      return false;
    }
  },

  // 格式化时间
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(
        seconds % 60
      ).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  },

  // 格式化文件大小
  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // 下载文件
  downloadFile(content, filename, contentType = "text/plain") {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 显示提示消息
  showToast(message, type = "info", duration = 3000) {
    // 移除已存在的toast
    const existingToast = document.querySelector(".toolbox-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toolbox-toast toolbox-toast-${type}`;
    toast.textContent = message;

    const style = document.createElement("style");
    style.textContent = `
      .toolbox-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: toolbox-toast-in 0.3s ease;
      }
      .toolbox-toast-success {
        color: var(--success-color, #0e8c52);
        border: 2px solid var(--success-color, #0e8c52);
      }
      .toolbox-toast-error {
        color: var(--error-color, #e74c3c);
        border: 2px solid var(--error-color, #e74c3c);
      }
      .toolbox-toast-warning {
        color: var(--warning-color, #f39c12);
        border: 2px solid var(--warning-color, #f39c12);
      }
      .toolbox-toast-info {
        color: var(--info-color, #1ab370);
        border: 2px solid var(--info-color, #1ab370);
      }
      @keyframes toolbox-toast-in {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;

    if (!document.querySelector("#toolbox-toast-style")) {
      style.id = "toolbox-toast-style";
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "toolbox-toast-in 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
};

// 初始化主题
document.addEventListener("DOMContentLoaded", () => {
  const theme = Storage.getTheme();
  document.documentElement.setAttribute("data-theme", theme);
});
