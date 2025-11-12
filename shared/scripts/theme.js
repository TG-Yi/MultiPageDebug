// 主题管理系统

/**
 * 预设主题配置
 */
const PRESET_THEMES = {
  dawn: {
    id: "dawn",
    name: "黎明破晓",
    icon: "🌅",
    description: "温暖的日出时分,充满希望",
    colors: {
      bg1: "#1e3a5f",
      bg2: "#3d5a80",
      bg3: "#ee6c4d",
      bg4: "#f4a261",
      bg5: "#e9c46a",
      bg6: "#98c1d9",
      primary: "#ee6c4d",
      secondary: "#f4a261",
      accent: "#e9c46a",
    },
  },
  sunrise: {
    id: "sunrise",
    name: "旭日东升",
    icon: "☀️",
    description: "明亮的朝阳,活力四射",
    colors: {
      bg1: "#2d4059",
      bg2: "#ea5455",
      bg3: "#f07b3f",
      bg4: "#ffd460",
      bg5: "#ffb26b",
      bg6: "#ffd89b",
      primary: "#ea5455",
      secondary: "#f07b3f",
      accent: "#ffd460",
    },
  },
  earlyMorning: {
    id: "earlyMorning",
    name: "清晨薄雾",
    icon: "🌄",
    description: "宁静的清晨,淡雅清新",
    colors: {
      bg1: "#2c3e50",
      bg2: "#546e7a",
      bg3: "#f8b195",
      bg4: "#f67280",
      bg5: "#c06c84",
      bg6: "#a8d8ea",
      primary: "#f8b195",
      secondary: "#f67280",
      accent: "#c06c84",
    },
  },
  goldenHour: {
    id: "goldenHour",
    name: "黄金时刻",
    icon: "✨",
    description: "金色的晨光,温柔梦幻",
    colors: {
      bg1: "#355c7d",
      bg2: "#6c5b7b",
      bg3: "#c06c84",
      bg4: "#f67280",
      bg5: "#f8b195",
      bg6: "#fde2e4",
      primary: "#c06c84",
      secondary: "#f67280",
      accent: "#f8b195",
    },
  },
  pastelDawn: {
    id: "pastelDawn",
    name: "柔和晨曦",
    icon: "🎨",
    description: "柔和的马卡龙色调",
    colors: {
      bg1: "#4a5568",
      bg2: "#667eea",
      bg3: "#f093fb",
      bg4: "#f5576c",
      bg5: "#ffa8a8",
      bg6: "#b8e6f0",
      primary: "#f093fb",
      secondary: "#f5576c",
      accent: "#ffa8a8",
    },
  },
  oceanDawn: {
    id: "oceanDawn",
    name: "海上日出",
    icon: "🌊",
    description: "海天交接的蓝色调",
    colors: {
      bg1: "#1a1f3a",
      bg2: "#2d4263",
      bg3: "#c84b31",
      bg4: "#ecdbba",
      bg5: "#8fbdd3",
      bg6: "#a8e6cf",
      primary: "#c84b31",
      secondary: "#ecdbba",
      accent: "#8fbdd3",
    },
  },
};

/**
 * 主题管理器
 */
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.customTheme = null;
    this.storageKey = "toolbox_theme";
    this.customStorageKey = "toolbox_custom_theme";
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    // 从本地存储加载主题
    const savedThemeId = localStorage.getItem(this.storageKey);
    const savedCustomTheme = localStorage.getItem(this.customStorageKey);

    if (savedCustomTheme) {
      try {
        this.customTheme = JSON.parse(savedCustomTheme);
      } catch (e) {
        console.error("加载自定义主题失败:", e);
      }
    }

    // 应用保存的主题
    if (savedThemeId === "custom" && this.customTheme) {
      this.applyCustomTheme(this.customTheme);
    } else if (savedThemeId && PRESET_THEMES[savedThemeId]) {
      this.applyTheme(savedThemeId);
    } else {
      // 默认使用黎明主题
      this.applyTheme("dawn");
    }
  }

  /**
   * 应用预设主题
   */
  applyTheme(themeId) {
    const theme = PRESET_THEMES[themeId];
    if (!theme) {
      console.error("主题不存在:", themeId);
      return;
    }

    this.currentTheme = theme;
    this._applyColors(theme.colors);
    localStorage.setItem(this.storageKey, themeId);

    // 触发主题变更事件
    this._triggerThemeChange(theme);
  }

  /**
   * 应用自定义主题
   */
  applyCustomTheme(colors) {
    this.customTheme = colors;
    this.currentTheme = {
      id: "custom",
      name: "自定义主题",
      icon: "🎨",
      colors: colors,
    };

    this._applyColors(colors);
    localStorage.setItem(this.storageKey, "custom");
    localStorage.setItem(this.customStorageKey, JSON.stringify(colors));

    this._triggerThemeChange(this.currentTheme);
  }

  /**
   * 应用颜色到页面
   */
  _applyColors(colors) {
    const root = document.documentElement;

    // 设置CSS变量
    root.style.setProperty("--primary-color", colors.primary);
    root.style.setProperty("--secondary-color", colors.secondary);
    root.style.setProperty("--accent-color", colors.accent);
    root.style.setProperty("--primary-dark", this._darkenColor(colors.primary));

    // 更新背景渐变
    const gradient = `linear-gradient(
      135deg,
      ${colors.bg1} 0%,
      ${colors.bg2} 15%,
      ${colors.bg3} 45%,
      ${colors.bg4} 65%,
      ${colors.bg5} 85%,
      ${colors.bg6} 100%
    )`;

    document.body.style.background = gradient;

    // 更新精选卡片渐变
    const featuredGradient = `linear-gradient(135deg, ${colors.bg3} 0%, ${colors.bg4} 50%, ${colors.bg5} 100%)`;
    const style = document.createElement("style");
    style.id = "theme-dynamic-styles";

    // 移除旧样式
    const oldStyle = document.getElementById("theme-dynamic-styles");
    if (oldStyle) oldStyle.remove();

    style.textContent = `
      .tool-card.featured {
        background: ${featuredGradient} !important;
      }
      .tool-card::before {
        background: linear-gradient(90deg, ${colors.bg3}, ${colors.bg4}, ${colors.bg5}) !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * 加深颜色
   */
  _darkenColor(hex, percent = 20) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  }

  /**
   * 触发主题变更事件
   */
  _triggerThemeChange(theme) {
    const event = new CustomEvent("themechange", {
      detail: { theme },
    });
    window.dispatchEvent(event);
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 获取所有预设主题
   */
  getPresetThemes() {
    return PRESET_THEMES;
  }

  /**
   * 获取自定义主题
   */
  getCustomTheme() {
    return this.customTheme;
  }

  /**
   * 重置为默认主题
   */
  reset() {
    this.applyTheme("dawn");
    localStorage.removeItem(this.customStorageKey);
  }
}

/**
 * 自动主题配置
 */
const AUTO_THEME_PRESETS = {
  // 预设1: 全天候黎明系列
  allDayDawn: {
    id: "allDayDawn",
    name: "全天黎明",
    description: "全天使用黎明系列主题",
    schedule: [
      { start: "00:00", end: "06:00", theme: "dawn" },
      { start: "06:00", end: "09:00", theme: "sunrise" },
      { start: "09:00", end: "12:00", theme: "earlyMorning" },
      { start: "12:00", end: "15:00", theme: "goldenHour" },
      { start: "15:00", end: "18:00", theme: "pastelDawn" },
      { start: "18:00", end: "24:00", theme: "oceanDawn" },
    ],
  },
  // 预设2: 简化版(白天/夜晚)
  dayNight: {
    id: "dayNight",
    name: "昼夜交替",
    description: "白天明亮,夜晚柔和",
    schedule: [
      { start: "00:00", end: "06:00", theme: "oceanDawn" },
      { start: "06:00", end: "18:00", theme: "sunrise" },
      { start: "18:00", end: "24:00", theme: "pastelDawn" },
    ],
  },
  // 预设3: 工作时间优化
  workHours: {
    id: "workHours",
    name: "工作时段",
    description: "工作时间护眼,休息时间温暖",
    schedule: [
      { start: "00:00", end: "08:00", theme: "oceanDawn" },
      { start: "08:00", end: "12:00", theme: "earlyMorning" },
      { start: "12:00", end: "14:00", theme: "pastelDawn" },
      { start: "14:00", end: "18:00", theme: "earlyMorning" },
      { start: "18:00", end: "24:00", theme: "goldenHour" },
    ],
  },
  // 预设4: 四季轮换
  seasonal: {
    id: "seasonal",
    name: "四时变换",
    description: "每6小时切换一次主题",
    schedule: [
      { start: "00:00", end: "06:00", theme: "oceanDawn" },
      { start: "06:00", end: "12:00", theme: "dawn" },
      { start: "12:00", end: "18:00", theme: "sunrise" },
      { start: "18:00", end: "24:00", theme: "goldenHour" },
    ],
  },
  // 自定义方案
  custom: {
    id: "custom",
    name: "自定义方案",
    description: "用户自定义时间段和主题",
    isCustom: true,
    schedule: [
      { start: "00:00", end: "24:00", theme: "dawn" },
    ],
  },
};

/**
 * 自动主题管理器
 */
class AutoThemeManager {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.enabled = false;
    this.currentPreset = null;
    this.timer = null;
    this.storageKey = "toolbox_auto_theme";
    this.customScheduleKey = "toolbox_custom_schedule";
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    // 加载自定义方案
    this.loadCustomSchedule();

    // 从本地存储加载配置
    const savedConfig = localStorage.getItem(this.storageKey);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.enabled = config.enabled !== false; // 默认开启
        this.currentPreset = config.preset || "allDayDawn";
      } catch (e) {
        console.error("加载自动主题配置失败:", e);
        this.enabled = true; // 默认开启
        this.currentPreset = "allDayDawn";
      }
    } else {
      // 首次使用,默认开启
      this.enabled = true;
      this.currentPreset = "allDayDawn";
      this.saveConfig();
    }

    if (this.enabled) {
      this.start();
    }
  }

  /**
   * 启动自动切换
   */
  start() {
    this.enabled = true;
    this.saveConfig();

    // 立即应用当前时间段的主题
    this.applyCurrentTheme();

    // 每分钟检查一次是否需要切换主题
    this.timer = setInterval(() => {
      this.applyCurrentTheme();
    }, 60000); // 60秒检查一次

    // 更新徽章显示
    this.updateBadge();

    console.log("自动主题已启动:", this.currentPreset);
  }

  /**
   * 停止自动切换
   */
  stop() {
    this.enabled = false;
    this.saveConfig();

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // 更新徽章显示
    this.updateBadge();

    console.log("自动主题已停止");
  }

  /**
   * 应用当前时间段的主题
   */
  applyCurrentTheme() {
    if (!this.enabled || !this.currentPreset) return;

    const preset = AUTO_THEME_PRESETS[this.currentPreset];
    if (!preset) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // 找到当前时间段对应的主题
    const schedule = preset.schedule.find((item) => {
      return currentTime >= item.start && currentTime < item.end;
    });

    if (schedule) {
      const targetTheme = schedule.theme;
      const currentTheme = this.themeManager.getCurrentTheme();

      // 只有当目标主题与当前主题不同时才切换
      if (!currentTheme || currentTheme.id !== targetTheme) {
        this.themeManager.applyTheme(targetTheme);
        console.log(
          `自动切换主题: ${targetTheme} (时间: ${currentTime})`
        );
      }
    }
  }

  /**
   * 设置预设方案
   */
  setPreset(presetId) {
    if (!AUTO_THEME_PRESETS[presetId]) {
      console.error("预设方案不存在:", presetId);
      return;
    }

    this.currentPreset = presetId;
    this.saveConfig();

    if (this.enabled) {
      this.applyCurrentTheme();
    }
  }

  /**
   * 切换启用状态
   */
  toggle() {
    if (this.enabled) {
      this.stop();
    } else {
      this.start();
    }
    return this.enabled;
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return {
      enabled: this.enabled,
      preset: this.currentPreset,
      currentTime: new Date().toTimeString().slice(0, 5),
      availablePresets: Object.values(AUTO_THEME_PRESETS),
    };
  }

  /**
   * 保存配置
   */
  saveConfig() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        enabled: this.enabled,
        preset: this.currentPreset,
      })
    );
  }

  /**
   * 获取当前应该使用的主题
   */
  getCurrentScheduledTheme() {
    if (!this.currentPreset) return null;

    const preset = AUTO_THEME_PRESETS[this.currentPreset];
    if (!preset) return null;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const schedule = preset.schedule.find((item) => {
      return currentTime >= item.start && currentTime < item.end;
    });

    return schedule ? schedule.theme : null;
  }

  /**
   * 加载自定义方案
   */
  loadCustomSchedule() {
    const saved = localStorage.getItem(this.customScheduleKey);
    if (saved) {
      try {
        const schedule = JSON.parse(saved);
        AUTO_THEME_PRESETS.custom.schedule = schedule;
      } catch (e) {
        console.error("加载自定义方案失败:", e);
      }
    }
  }

  /**
   * 保存自定义方案
   */
  saveCustomSchedule(schedule) {
    try {
      localStorage.setItem(this.customScheduleKey, JSON.stringify(schedule));
      AUTO_THEME_PRESETS.custom.schedule = schedule;
      console.log("自定义方案已保存");
      return true;
    } catch (e) {
      console.error("保存自定义方案失败:", e);
      return false;
    }
  }

  /**
   * 获取自定义方案
   */
  getCustomSchedule() {
    return AUTO_THEME_PRESETS.custom.schedule;
  }

  /**
   * 验证时间段配置
   */
  validateSchedule(schedule) {
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return { valid: false, error: "时间段不能为空" };
    }

    // 按开始时间排序
    const sorted = [...schedule].sort((a, b) => a.start.localeCompare(b.start));

    // 检查是否有重叠
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].end > sorted[i + 1].start) {
        return {
          valid: false,
          error: `时间段重叠: ${sorted[i].start}-${sorted[i].end} 与 ${sorted[i + 1].start}-${sorted[i + 1].end}`
        };
      }
    }

    // 检查是否覆盖24小时
    if (sorted[0].start !== "00:00") {
      return { valid: false, error: "第一个时间段必须从 00:00 开始" };
    }

    if (sorted[sorted.length - 1].end !== "24:00") {
      return { valid: false, error: "最后一个时间段必须到 24:00 结束" };
    }

    // 检查是否有间隙
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].end !== sorted[i + 1].start) {
        return {
          valid: false,
          error: `时间段有间隙: ${sorted[i].end} 到 ${sorted[i + 1].start}`
        };
      }
    }

    // 检查每个主题是否有效
    for (const item of schedule) {
      if (!item.theme || !PRESET_THEMES[item.theme]) {
        return { valid: false, error: `无效的主题: ${item.theme}` };
      }
    }

    return { valid: true };
  }

  /**
   * 更新主题按钮上的自动徽章
   */
  updateBadge() {
    const badge = document.getElementById("auto-badge");
    if (badge) {
      if (this.enabled) {
        badge.classList.add("active");
      } else {
        badge.classList.remove("active");
      }
    }
  }
}

// 创建全局主题管理器实例
window.themeManager = new ThemeManager();

// 创建全局自动主题管理器实例
window.autoThemeManager = new AutoThemeManager(window.themeManager);

// 页面加载完成后更新徽章
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.autoThemeManager.updateBadge();
    initThemeButtonDrag();
  });
} else {
  window.autoThemeManager.updateBadge();
  initThemeButtonDrag();
}

/**
 * 打开主题选择器
 */
function openThemeSelector() {
  // 检查是否已存在
  let modal = document.getElementById("theme-selector-modal");
  if (modal) {
    modal.classList.add("show");
    return;
  }

  // 创建模态框
  modal = document.createElement("div");
  modal.id = "theme-selector-modal";
  modal.className = "theme-modal";
  modal.innerHTML = `
    <div class="theme-modal-overlay"></div>
    <div class="theme-modal-content">
      <div class="theme-modal-header">
        <h2>🎨 主题设置</h2>
        <button class="theme-modal-close" onclick="closeThemeSelector()">✕</button>
      </div>

      <div class="theme-modal-body">
        <!-- 自动主题 -->
        <div class="theme-section">
          <div class="theme-section-header">
            <h3>⏰ 自动主题</h3>
            <label class="theme-toggle-switch">
              <input type="checkbox" id="auto-theme-toggle" ${window.autoThemeManager.enabled ? "checked" : ""} onchange="toggleAutoTheme()">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p class="theme-section-desc">根据时间段自动切换主题,让界面随着一天的时光流转</p>

          <div class="auto-theme-content" id="auto-theme-content">
            <!-- 预设方案选择 -->
            <div class="auto-theme-presets" id="auto-theme-presets"></div>

            <!-- 当前状态 -->
            <div class="auto-theme-status">
              <div class="status-item">
                <span class="status-label">当前时间</span>
                <span class="status-value" id="current-time">--:--</span>
              </div>
              <div class="status-item">
                <span class="status-label">正在使用</span>
                <span class="status-value" id="current-theme-name">--</span>
              </div>
              <div class="status-item">
                <span class="status-label">下次切换</span>
                <span class="status-value" id="next-change-time">--:--</span>
              </div>
            </div>

            <!-- 时间轴预览 -->
            <div class="auto-theme-timeline" id="auto-theme-timeline"></div>
          </div>
        </div>

        <!-- 预设主题 -->
        <div class="theme-section">
          <h3>🎨 预设主题</h3>
          <p class="theme-section-desc">精选的黎明系列配色方案</p>
          <div class="theme-grid" id="preset-themes"></div>
        </div>

        <!-- 自定义主题 -->
        <div class="theme-section">
          <h3>✏️ 自定义主题</h3>
          <p class="theme-section-desc">创造属于你的独特配色</p>
          <div class="theme-custom">
            <div class="theme-custom-preview" id="custom-preview">
              <div class="custom-preview-gradient"></div>
              <p>自定义渐变预览</p>
            </div>
            <div class="theme-custom-controls">
              <div class="color-input-group">
                <label>夜幕深蓝 <input type="color" id="color-bg1" value="#1e3a5f"></label>
                <label>暮色蓝灰 <input type="color" id="color-bg2" value="#3d5a80"></label>
                <label>日出橙红 <input type="color" id="color-bg3" value="#ee6c4d"></label>
              </div>
              <div class="color-input-group">
                <label>晨曦金橙 <input type="color" id="color-bg4" value="#f4a261"></label>
                <label>朝霞金黄 <input type="color" id="color-bg5" value="#e9c46a"></label>
                <label>黎明天蓝 <input type="color" id="color-bg6" value="#98c1d9"></label>
              </div>
              <div class="theme-custom-actions">
                <button class="theme-btn theme-btn-secondary" onclick="resetCustomTheme()">重置</button>
                <button class="theme-btn theme-btn-primary" onclick="applyCustomTheme()">应用自定义主题</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 添加样式
  addThemeSelectorStyles();

  // 渲染预设主题
  renderPresetThemes();

  // 渲染自动主题内容
  renderAutoThemeContent();

  // 绑定事件
  bindThemeSelectorEvents();

  // 显示模态框
  setTimeout(() => modal.classList.add("show"), 10);
}

/**
 * 关闭主题选择器
 */
function closeThemeSelector() {
  const modal = document.getElementById("theme-selector-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  }
}

/**
 * 渲染预设主题
 */
function renderPresetThemes() {
  const container = document.getElementById("preset-themes");
  const themes = window.themeManager.getPresetThemes();
  const currentTheme = window.themeManager.getCurrentTheme();

  container.innerHTML = Object.values(themes)
    .map(
      (theme) => `
    <div class="theme-card ${currentTheme?.id === theme.id ? "active" : ""}"
         data-theme-id="${theme.id}"
         onclick="selectPresetTheme('${theme.id}')">
      <div class="theme-card-preview" style="background: linear-gradient(135deg, ${theme.colors.bg1}, ${theme.colors.bg3}, ${theme.colors.bg5}, ${theme.colors.bg6})"></div>
      <div class="theme-card-info">
        <div class="theme-card-icon">${theme.icon}</div>
        <div class="theme-card-name">${theme.name}</div>
        <div class="theme-card-desc">${theme.description}</div>
      </div>
      <div class="theme-card-check">✓</div>
    </div>
  `
    )
    .join("");
}

/**
 * 选择预设主题
 */
function selectPresetTheme(themeId) {
  window.themeManager.applyTheme(themeId);

  // 更新选中状态
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.themeId === themeId);
  });

  // 显示成功提示
  if (typeof Utils !== "undefined") {
    Utils.showToast(`已切换到 ${PRESET_THEMES[themeId].name}`, "success", 2000);
  }
}

/**
 * 应用自定义主题
 */
function applyCustomTheme() {
  const colors = {
    bg1: document.getElementById("color-bg1").value,
    bg2: document.getElementById("color-bg2").value,
    bg3: document.getElementById("color-bg3").value,
    bg4: document.getElementById("color-bg4").value,
    bg5: document.getElementById("color-bg5").value,
    bg6: document.getElementById("color-bg6").value,
    primary: document.getElementById("color-bg3").value,
    secondary: document.getElementById("color-bg4").value,
    accent: document.getElementById("color-bg5").value,
  };

  window.themeManager.applyCustomTheme(colors);

  // 取消预设主题的选中状态
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.classList.remove("active");
  });

  if (typeof Utils !== "undefined") {
    Utils.showToast("已应用自定义主题", "success", 2000);
  }
}

/**
 * 重置自定义主题
 */
function resetCustomTheme() {
  const defaults = PRESET_THEMES.dawn.colors;
  document.getElementById("color-bg1").value = defaults.bg1;
  document.getElementById("color-bg2").value = defaults.bg2;
  document.getElementById("color-bg3").value = defaults.bg3;
  document.getElementById("color-bg4").value = defaults.bg4;
  document.getElementById("color-bg5").value = defaults.bg5;
  document.getElementById("color-bg6").value = defaults.bg6;
  updateCustomPreview();
}

/**
 * 更新自定义预览
 */
function updateCustomPreview() {
  const preview = document.querySelector(".custom-preview-gradient");
  if (!preview) return;

  const colors = {
    bg1: document.getElementById("color-bg1").value,
    bg2: document.getElementById("color-bg2").value,
    bg3: document.getElementById("color-bg3").value,
    bg4: document.getElementById("color-bg4").value,
    bg5: document.getElementById("color-bg5").value,
    bg6: document.getElementById("color-bg6").value,
  };

  preview.style.background = `linear-gradient(135deg, ${colors.bg1} 0%, ${colors.bg2} 15%, ${colors.bg3} 45%, ${colors.bg4} 65%, ${colors.bg5} 85%, ${colors.bg6} 100%)`;
}

/**
 * 渲染自动主题内容
 */
function renderAutoThemeContent() {
  const autoThemeManager = window.autoThemeManager;
  const config = autoThemeManager.getConfig();

  // 渲染预设方案
  const presetsContainer = document.getElementById("auto-theme-presets");
  presetsContainer.innerHTML = Object.values(AUTO_THEME_PRESETS)
    .map(
      (preset) => {
        // 自定义方案添加编辑按钮
        if (preset.isCustom) {
          return `
    <div class="auto-preset-card custom ${config.preset === preset.id ? "active" : ""}"
         data-preset-id="${preset.id}">
      <div class="auto-preset-header">
        <div class="auto-preset-name">${preset.name}</div>
        <button class="edit-custom-btn" onclick="openCustomScheduleEditor(event)" title="编辑自定义方案">
          ✏️
        </button>
      </div>
      <div class="auto-preset-desc">${preset.description}</div>
      <div class="auto-preset-count">${preset.schedule.length} 个时段</div>
      <button class="select-preset-btn" onclick="selectAutoPreset('${preset.id}')">
        ${config.preset === preset.id ? '已选择' : '选择此方案'}
      </button>
    </div>
  `;
        }

        // 普通预设方案
        return `
    <div class="auto-preset-card ${config.preset === preset.id ? "active" : ""}"
         data-preset-id="${preset.id}"
         onclick="selectAutoPreset('${preset.id}')">
      <div class="auto-preset-name">${preset.name}</div>
      <div class="auto-preset-desc">${preset.description}</div>
      <div class="auto-preset-count">${preset.schedule.length} 个时段</div>
    </div>
  `;
      }
    )
    .join("");

  // 更新状态信息
  updateAutoThemeStatus();

  // 渲染时间轴
  renderAutoThemeTimeline();

  // 更新自动主题区域的显示状态
  const autoContent = document.getElementById("auto-theme-content");
  if (autoContent) {
    autoContent.style.display = config.enabled ? "block" : "none";
  }
}

/**
 * 更新自动主题状态信息
 */
function updateAutoThemeStatus() {
  const config = window.autoThemeManager.getConfig();
  const currentTheme = window.themeManager.getCurrentTheme();

  // 更新当前时间
  const timeEl = document.getElementById("current-time");
  if (timeEl) {
    timeEl.textContent = config.currentTime;
  }

  // 更新当前主题名称
  const themeNameEl = document.getElementById("current-theme-name");
  if (themeNameEl && currentTheme) {
    themeNameEl.textContent = currentTheme.name;
  }

  // 计算下次切换时间
  const nextChangeEl = document.getElementById("next-change-time");
  if (nextChangeEl && config.enabled && config.preset) {
    const nextTime = getNextChangeTime(config.preset);
    nextChangeEl.textContent = nextTime || "未知";
  }
}

/**
 * 获取下次切换时间
 */
function getNextChangeTime(presetId) {
  const preset = AUTO_THEME_PRESETS[presetId];
  if (!preset) return null;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // 找到下一个时间段
  for (let i = 0; i < preset.schedule.length; i++) {
    const item = preset.schedule[i];
    if (currentTime < item.end) {
      return item.end;
    }
  }

  // 如果已经过了所有时间段,返回明天第一个时间段的开始时间
  return preset.schedule[0].start + " (明天)";
}

/**
 * 渲染自动主题时间轴
 */
function renderAutoThemeTimeline() {
  const timelineContainer = document.getElementById("auto-theme-timeline");
  if (!timelineContainer) return;

  const config = window.autoThemeManager.getConfig();
  if (!config.enabled || !config.preset) {
    timelineContainer.innerHTML = "";
    return;
  }

  const preset = AUTO_THEME_PRESETS[config.preset];
  if (!preset) return;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  timelineContainer.innerHTML = `
    <div class="timeline-header">24小时主题时间轴</div>
    <div class="timeline-items">
      ${preset.schedule
        .map((item) => {
          const theme = PRESET_THEMES[item.theme];
          const isActive = currentTime >= item.start && currentTime < item.end;
          return `
          <div class="timeline-item ${isActive ? "active" : ""}"
               style="background: linear-gradient(135deg, ${theme.colors.bg3}, ${theme.colors.bg5})">
            <div class="timeline-time">${item.start} - ${item.end}</div>
            <div class="timeline-theme">
              <span class="timeline-icon">${theme.icon}</span>
              <span class="timeline-name">${theme.name}</span>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

/**
 * 切换自动主题
 */
function toggleAutoTheme() {
  const checkbox = document.getElementById("auto-theme-toggle");
  const enabled = checkbox.checked;

  if (enabled) {
    window.autoThemeManager.start();
  } else {
    window.autoThemeManager.stop();
  }

  // 更新UI显示
  const autoContent = document.getElementById("auto-theme-content");
  if (autoContent) {
    autoContent.style.display = enabled ? "block" : "none";
  }

  if (enabled) {
    updateAutoThemeStatus();
    renderAutoThemeTimeline();
  }

  // 更新徽章状态(已在start/stop中调用,此处无需重复)

  if (typeof Utils !== "undefined") {
    Utils.showToast(
      enabled ? "已启用自动主题切换" : "已禁用自动主题切换",
      "success",
      2000
    );
  }
}

/**
 * 选择自动主题预设方案
 */
function selectAutoPreset(presetId) {
  window.autoThemeManager.setPreset(presetId);

  // 更新选中状态
  document.querySelectorAll(".auto-preset-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.presetId === presetId);
  });

  // 更新状态和时间轴
  updateAutoThemeStatus();
  renderAutoThemeTimeline();

  if (typeof Utils !== "undefined") {
    Utils.showToast(
      `已切换到 ${AUTO_THEME_PRESETS[presetId].name}`,
      "success",
      2000
    );
  }
}

/**
 * 绑定事件
 */
function bindThemeSelectorEvents() {
  // 颜色输入变化时更新预览
  ["bg1", "bg2", "bg3", "bg4", "bg5", "bg6"].forEach((id) => {
    const input = document.getElementById(`color-${id}`);
    if (input) {
      input.addEventListener("input", updateCustomPreview);
    }
  });

  // 点击遮罩关闭
  const overlay = document.querySelector(".theme-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", closeThemeSelector);
  }

  // ESC关闭
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeThemeSelector();
      document.removeEventListener("keydown", escHandler);
    }
  });

  // 加载自定义主题数据
  const customTheme = window.themeManager.getCustomTheme();
  if (customTheme) {
    document.getElementById("color-bg1").value = customTheme.bg1;
    document.getElementById("color-bg2").value = customTheme.bg2;
    document.getElementById("color-bg3").value = customTheme.bg3;
    document.getElementById("color-bg4").value = customTheme.bg4;
    document.getElementById("color-bg5").value = customTheme.bg5;
    document.getElementById("color-bg6").value = customTheme.bg6;
  }
  updateCustomPreview();
}

/**
 * 添加样式
 */
function addThemeSelectorStyles() {
  if (document.getElementById("theme-selector-styles")) return;

  const style = document.createElement("style");
  style.id = "theme-selector-styles";
  style.textContent = `
    .theme-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .theme-modal.show {
      opacity: 1;
    }

    .theme-modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
    }

    .theme-modal-content {
      position: relative;
      width: 90%;
      max-width: 900px;
      max-height: 85vh;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }

    .theme-modal.show .theme-modal-content {
      transform: translateY(0);
    }

    .theme-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 30px;
      border-bottom: 2px solid #f0f0f0;
    }

    .theme-modal-header h2 {
      margin: 0;
      font-size: 24px;
      color: #2c3e50;
    }

    .theme-modal-close {
      width: 36px;
      height: 36px;
      border: none;
      background: #f0f0f0;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-modal-close:hover {
      background: #e0e0e0;
      transform: rotate(90deg);
    }

    .theme-modal-body {
      padding: 30px;
      max-height: calc(85vh - 100px);
      overflow-y: auto;
    }

    .theme-section {
      margin-bottom: 40px;
    }

    .theme-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }

    .theme-section h3 {
      font-size: 18px;
      color: #2c3e50;
      margin: 0;
    }

    .theme-section-desc {
      font-size: 14px;
      color: #7f8c8d;
      margin: -10px 0 20px 0;
    }

    /* 切换开关 */
    .theme-toggle-switch {
      position: relative;
      display: inline-block;
      width: 56px;
      height: 28px;
    }

    .theme-toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 28px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .theme-toggle-switch input:checked + .toggle-slider {
      background-color: var(--primary-color);
    }

    .theme-toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(28px);
    }

    /* 自动主题内容区域 */
    .auto-theme-content {
      margin-top: 20px;
    }

    /* 自动主题预设卡片 */
    .auto-theme-presets {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }

    .auto-preset-card {
      padding: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f9f9f9;
    }

    .auto-preset-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-color);
    }

    .auto-preset-card.active {
      border-color: var(--primary-color);
      border-width: 3px;
      background: linear-gradient(135deg, rgba(238, 108, 77, 0.05), rgba(244, 162, 97, 0.05));
    }

    .auto-preset-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .auto-preset-desc {
      font-size: 13px;
      color: #7f8c8d;
      margin-bottom: 10px;
    }

    .auto-preset-count {
      font-size: 12px;
      color: var(--primary-color);
      font-weight: 500;
    }

    /* 状态信息 */
    .auto-theme-status {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      border-radius: 12px;
    }

    .status-item {
      text-align: center;
    }

    .status-label {
      display: block;
      font-size: 12px;
      color: #5a6c7d;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .status-value {
      display: block;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
    }

    /* 时间轴 */
    .auto-theme-timeline {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      background: white;
    }

    .timeline-header {
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 15px;
      text-align: center;
    }

    .timeline-items {
      display: grid;
      gap: 10px;
    }

    .timeline-item {
      padding: 15px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      transition: all 0.3s ease;
      opacity: 0.7;
    }

    .timeline-item.active {
      opacity: 1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transform: scale(1.02);
    }

    .timeline-time {
      font-size: 13px;
      font-weight: 600;
    }

    .timeline-theme {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .timeline-icon {
      font-size: 20px;
    }

    .timeline-name {
      font-size: 14px;
      font-weight: 500;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .theme-card {
      position: relative;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .theme-card.active {
      border-color: var(--primary-color);
      border-width: 3px;
    }

    .theme-card-preview {
      height: 100px;
      width: 100%;
    }

    .theme-card-info {
      padding: 15px;
    }

    .theme-card-icon {
      font-size: 32px;
      text-align: center;
      margin-bottom: 8px;
    }

    .theme-card-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 6px;
    }

    .theme-card-desc {
      font-size: 12px;
      color: #7f8c8d;
      text-align: center;
    }

    .theme-card-check {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 28px;
      height: 28px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }

    .theme-card.active .theme-card-check {
      opacity: 1;
      transform: scale(1);
    }

    .theme-custom {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
    }

    .theme-custom-preview {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .custom-preview-gradient {
      width: 100%;
      height: 200px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .theme-custom-preview p {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .color-input-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .color-input-group label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
      color: #7f8c8d;
      font-weight: 500;
    }

    .color-input-group input[type="color"] {
      width: 100%;
      height: 50px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .color-input-group input[type="color"]:hover {
      border-color: var(--primary-color);
    }

    .theme-custom-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .theme-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .theme-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .theme-btn-secondary {
      background: #f0f0f0;
      color: #7f8c8d;
    }

    .theme-btn-secondary:hover {
      background: #e0e0e0;
    }

    @media (max-width: 768px) {
      .theme-modal-content {
        width: 95%;
        max-height: 90vh;
      }

      .theme-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      }

      .theme-custom {
        grid-template-columns: 1fr;
      }

      .color-input-group {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .auto-theme-presets {
        grid-template-columns: 1fr;
      }

      .auto-theme-status {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-label {
        margin-bottom: 0;
      }
    }

    /* 自定义方案卡片样式 */
    .auto-preset-card.custom {
      position: relative;
      border: 2px dashed var(--primary-color);
      background: linear-gradient(135deg, rgba(238, 108, 77, 0.08), rgba(244, 162, 97, 0.08));
    }

    .auto-preset-card.custom .auto-preset-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .auto-preset-card.custom .auto-preset-name {
      margin-bottom: 0;
    }

    .edit-custom-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .edit-custom-btn:hover {
      background: var(--primary-dark);
      transform: scale(1.1);
    }

    .select-preset-btn {
      width: 100%;
      margin-top: 12px;
      padding: 8px 16px;
      border: none;
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .select-preset-btn:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(238, 108, 77, 0.3);
    }

    .auto-preset-card.active .select-preset-btn {
      background: #27ae60;
    }

    .auto-preset-card.active .select-preset-btn:hover {
      background: #229954;
    }

    /* 自定义时间段编辑器 */
    .custom-schedule-editor {
      max-width: 800px;
    }

    .custom-schedule-desc {
      background: linear-gradient(135deg, rgba(238, 108, 77, 0.1), rgba(244, 162, 97, 0.1));
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .custom-schedule-desc p {
      margin: 0;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }

    .custom-schedule-list {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .time-segment-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .time-segment-item:hover {
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .segment-number {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .segment-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .time-input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .time-input-group label {
      font-size: 12px;
      color: #7f8c8d;
      font-weight: 500;
    }

    .time-input-group input[type="time"] {
      padding: 8px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      transition: all 0.3s ease;
      width: 120px;
    }

    .time-input-group input[type="time"]:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(238, 108, 77, 0.1);
    }

    .time-separator {
      font-size: 20px;
      color: var(--primary-color);
      font-weight: 600;
      margin: 0 4px;
      padding-top: 18px;
    }

    .segment-theme {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 180px;
    }

    .segment-theme label {
      font-size: 12px;
      color: #7f8c8d;
      font-weight: 500;
    }

    .theme-select {
      padding: 8px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      color: #2c3e50;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(238, 108, 77, 0.1);
    }

    .segment-delete-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: #e74c3c;
      color: white;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .segment-delete-btn:hover:not(:disabled) {
      background: #c0392b;
      transform: scale(1.1);
    }

    .segment-delete-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .custom-schedule-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .custom-schedule-validation {
      min-height: 40px;
    }

    .validation-message {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .validation-message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .validation-message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* 响应式适配 - 自定义编辑器 */
    @media (max-width: 768px) {
      .time-segment-item {
        flex-wrap: wrap;
        gap: 8px;
      }

      .segment-inputs {
        width: 100%;
        flex-wrap: wrap;
      }

      .time-input-group input[type="time"] {
        width: 100px;
      }

      .segment-theme {
        width: 100%;
        min-width: auto;
      }

      .segment-delete-btn {
        position: absolute;
        top: 8px;
        right: 8px;
      }

      .custom-schedule-actions {
        flex-direction: column;
      }

      .custom-schedule-actions button {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * 初始化主题按钮拖拽功能
 */
function initThemeButtonDrag() {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // 从localStorage加载保存的位置
  const savedPosition = localStorage.getItem("theme_button_position");
  if (savedPosition) {
    try {
      const { x, y } = JSON.parse(savedPosition);
      xOffset = x;
      yOffset = y;
      setButtonPosition(btn, x, y);
    } catch (e) {
      console.error("加载按钮位置失败:", e);
      // 使用默认位置
      setDefaultPosition();
    }
  } else {
    // 首次加载,使用默认位置
    setDefaultPosition();
  }

  function setDefaultPosition() {
    // 默认位置: 右下角,距离边缘30px
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isMobile = windowWidth <= 768;

    if (isMobile) {
      // 移动端:固定在右下角
      xOffset = windowWidth - 70; // 50px按钮宽度 + 20px边距
      yOffset = windowHeight - 70;
    } else {
      // 桌面端:稍大的边距
      xOffset = windowWidth - 90; // 60px按钮宽度 + 30px边距
      yOffset = windowHeight - 90;
    }
    setButtonPosition(btn, xOffset, yOffset);
  }

  // 检查并修正移动端位置
  function checkMobilePosition() {
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;

    if (isMobile) {
      // 移动端:重置为默认位置
      btn.style.cssText = '';  // 清除所有inline样式
      btn.style.position = 'fixed';
      btn.style.bottom = '20px';
      btn.style.right = '20px';
      btn.style.left = 'auto';
      btn.style.top = 'auto';
    }
  }

  // 初始检查
  checkMobilePosition();

  // 监听窗口大小变化
  window.addEventListener('resize', checkMobilePosition);

  // 鼠标/触摸事件(仅在非移动端启用拖拽)
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    btn.addEventListener("mousedown", dragStart);
  }

  btn.addEventListener("touchstart", dragStart);

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);

  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd);

  function dragStart(e) {
    // 检查是否点击了徽章,如果是则不启动拖拽
    if (e.target.classList.contains("auto-badge")) {
      return;
    }

    // 记录鼠标按下时的绝对位置
    if (e.type === "touchstart") {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      startX = e.clientX;
      startY = e.clientY;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    isDragging = true;

    // 添加拖拽样式
    btn.classList.add("dragging");
    btn.style.cursor = "grabbing";
    btn.style.transition = "none";
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    // 移动端禁用拖拽视觉反馈,保持固定位置
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // 移动端只跟踪位置用于计算拖拽距离,不实际移动按钮
      return;
    }

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setButtonPosition(btn, currentX, currentY);
  }

  function dragEnd(e) {
    if (!isDragging) return;

    // 计算拖拽距离(从按下到释放的实际移动距离)
    let endX, endY;
    if (e.type === "touchend") {
      // 触摸结束时,使用changedTouches获取最后位置
      if (e.changedTouches && e.changedTouches.length > 0) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
      } else {
        // 如果没有changedTouches,使用记录的当前位置估算
        endX = startX;
        endY = startY;
      }
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    // 计算实际移动距离
    const dragDistance = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );

    isDragging = false;

    // 恢复样式
    btn.classList.remove("dragging");
    btn.style.cursor = "grab";
    btn.style.transition = "all 0.3s ease";

    // 移动端检查
    const windowWidth = window.innerWidth;
    const isMobileNow = windowWidth <= 768;

    if (isMobileNow) {
      // 移动端:重置为固定位置
      btn.style.cssText = '';
      btn.style.position = 'fixed';
      btn.style.bottom = '20px';
      btn.style.right = '20px';
      btn.style.left = 'auto';
      btn.style.top = 'auto';
    } else {
      // 桌面端:边界吸附
      snapToEdge(btn);
      // 保存位置
      saveButtonPosition(xOffset, yOffset);
    }

    // 如果拖拽距离很小,触发点击事件
    if (dragDistance < 5) {
      // 拖拽距离小于5px,认为是点击
      setTimeout(() => {
        openThemeSelector();
      }, 0);
    }
  }

  function setButtonPosition(element, x, y) {
    element.style.position = "fixed";
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.right = "auto";
    element.style.bottom = "auto";
  }

  function snapToEdge(element) {
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newX = xOffset;
    let newY = yOffset;

    // 水平方向吸附
    if (rect.left < windowWidth / 2) {
      // 靠左
      newX = 20;
    } else {
      // 靠右
      newX = windowWidth - rect.width - 20;
    }

    // 垂直方向限制
    if (rect.top < 20) {
      newY = 20;
    } else if (rect.bottom > windowHeight - 20) {
      newY = windowHeight - rect.height - 20;
    }

    xOffset = newX;
    yOffset = newY;

    setButtonPosition(element, newX, newY);
  }

  function saveButtonPosition(x, y) {
    localStorage.setItem(
      "theme_button_position",
      JSON.stringify({ x, y })
    );
  }
}

/**
 * 打开自定义时间段编辑器
 */
function openCustomScheduleEditor(event) {
  // 阻止事件冒泡,避免触发父元素的点击事件
  if (event) {
    event.stopPropagation();
  }

  // 检查是否已存在
  let modal = document.getElementById("custom-schedule-modal");
  if (modal) {
    modal.classList.add("show");
    renderCustomScheduleEditor();
    return;
  }

  // 创建模态框
  modal = document.createElement("div");
  modal.id = "custom-schedule-modal";
  modal.className = "theme-modal";
  modal.innerHTML = `
    <div class="theme-modal-overlay" onclick="closeCustomScheduleEditor()"></div>
    <div class="theme-modal-content custom-schedule-editor">
      <div class="theme-modal-header">
        <h2>⏰ 自定义时间方案</h2>
        <button class="theme-modal-close" onclick="closeCustomScheduleEditor()">✕</button>
      </div>

      <div class="theme-modal-body">
        <div class="custom-schedule-desc">
          <p>📝 设置一天中不同时间段使用的主题。时间段必须完整覆盖24小时(00:00-24:00),且不能重叠。</p>
        </div>

        <div class="custom-schedule-list" id="custom-schedule-list">
          <!-- 时间段列表动态渲染 -->
        </div>

        <div class="custom-schedule-actions">
          <button class="theme-btn theme-btn-secondary" onclick="addTimeSegment()">
            ➕ 添加时段
          </button>
          <button class="theme-btn theme-btn-primary" onclick="saveCustomSchedule()">
            💾 保存方案
          </button>
        </div>

        <div class="custom-schedule-validation" id="schedule-validation">
          <!-- 验证信息动态显示 -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 渲染编辑器内容
  renderCustomScheduleEditor();

  // 显示模态框
  setTimeout(() => modal.classList.add("show"), 10);
}

/**
 * 关闭自定义时间段编辑器
 */
function closeCustomScheduleEditor() {
  const modal = document.getElementById("custom-schedule-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  }
}

/**
 * 渲染自定义时间段编辑器
 */
function renderCustomScheduleEditor() {
  const schedule = window.autoThemeManager.getCustomSchedule();
  const listContainer = document.getElementById("custom-schedule-list");

  if (!listContainer) return;

  listContainer.innerHTML = schedule.map((segment, index) => {
    const themeName = PRESET_THEMES[segment.theme] ? PRESET_THEMES[segment.theme].name : segment.theme;
    const themeIcon = PRESET_THEMES[segment.theme] ? PRESET_THEMES[segment.theme].icon : "🎨";

    return `
      <div class="time-segment-item" data-index="${index}">
        <div class="segment-number">${index + 1}</div>
        <div class="segment-inputs">
          <div class="time-input-group">
            <label>开始</label>
            <input type="time" class="segment-start" value="${segment.start}"
                   onchange="updateSegmentTime(${index}, 'start', this.value)">
          </div>
          <div class="time-separator">→</div>
          <div class="time-input-group">
            <label>结束</label>
            <input type="time" class="segment-end" value="${segment.end}"
                   onchange="updateSegmentTime(${index}, 'end', this.value)">
          </div>
        </div>
        <div class="segment-theme">
          <label>主题</label>
          <select class="theme-select" onchange="updateSegmentTheme(${index}, this.value)">
            ${Object.values(PRESET_THEMES).map(theme => `
              <option value="${theme.id}" ${segment.theme === theme.id ? 'selected' : ''}>
                ${theme.icon} ${theme.name}
              </option>
            `).join('')}
          </select>
        </div>
        <button class="segment-delete-btn" onclick="removeTimeSegment(${index})"
                title="删除此时段" ${schedule.length <= 1 ? 'disabled' : ''}>
          🗑️
        </button>
      </div>
    `;
  }).join('');

  // 验证当前配置
  validateCurrentSchedule();
}

/**
 * 添加时间段
 */
function addTimeSegment() {
  const schedule = window.autoThemeManager.getCustomSchedule();

  // 计算新时段的默认时间
  let newStart = "00:00";
  let newEnd = "24:00";

  if (schedule.length > 0) {
    const lastSegment = schedule[schedule.length - 1];
    // 在最后一个时段前插入
    newStart = lastSegment.start;
    newEnd = lastSegment.end;

    // 计算中间时间
    const startMinutes = timeToMinutes(newStart);
    const endMinutes = timeToMinutes(newEnd);
    const midMinutes = Math.floor((startMinutes + endMinutes) / 2);
    const midTime = minutesToTime(midMinutes);

    // 分割最后一个时段
    schedule[schedule.length - 1].end = midTime;
    schedule.push({
      start: midTime,
      end: newEnd,
      theme: "dawn"
    });
  } else {
    schedule.push({
      start: "00:00",
      end: "24:00",
      theme: "dawn"
    });
  }

  // 重新渲染
  renderCustomScheduleEditor();
}

/**
 * 删除时间段
 */
function removeTimeSegment(index) {
  const schedule = window.autoThemeManager.getCustomSchedule();

  if (schedule.length <= 1) {
    Utils.showToast("至少需要保留一个时段", "warning");
    return;
  }

  // 删除时段
  schedule.splice(index, 1);

  // 如果删除的不是第一个,合并到前一个
  if (index > 0 && index < schedule.length) {
    schedule[index - 1].end = schedule[index].start;
  }

  // 重新渲染
  renderCustomScheduleEditor();
}

/**
 * 更新时段时间
 */
function updateSegmentTime(index, field, value) {
  const schedule = window.autoThemeManager.getCustomSchedule();

  if (field === 'start') {
    schedule[index].start = value;
    // 如果不是第一个时段,更新前一个的结束时间
    if (index > 0) {
      schedule[index - 1].end = value;
    }
  } else if (field === 'end') {
    schedule[index].end = value;
    // 如果不是最后一个时段,更新下一个的开始时间
    if (index < schedule.length - 1) {
      schedule[index + 1].start = value;
    }
  }

  // 重新渲染
  renderCustomScheduleEditor();
}

/**
 * 更新时段主题
 */
function updateSegmentTheme(index, themeId) {
  const schedule = window.autoThemeManager.getCustomSchedule();
  schedule[index].theme = themeId;

  // 验证配置
  validateCurrentSchedule();
}

/**
 * 验证当前时间段配置
 */
function validateCurrentSchedule() {
  const schedule = window.autoThemeManager.getCustomSchedule();
  const validation = window.autoThemeManager.validateSchedule(schedule);

  const validationEl = document.getElementById("schedule-validation");
  if (!validationEl) return;

  if (validation.valid) {
    validationEl.innerHTML = `
      <div class="validation-message success">
        ✅ 配置有效,可以保存
      </div>
    `;
  } else {
    validationEl.innerHTML = `
      <div class="validation-message error">
        ❌ ${validation.error}
      </div>
    `;
  }
}

/**
 * 保存自定义方案
 */
function saveCustomSchedule() {
  const schedule = window.autoThemeManager.getCustomSchedule();
  const validation = window.autoThemeManager.validateSchedule(schedule);

  if (!validation.valid) {
    Utils.showToast(validation.error, "error");
    return;
  }

  // 保存到localStorage
  const success = window.autoThemeManager.saveCustomSchedule(schedule);

  if (success) {
    Utils.showToast("自定义方案已保存", "success");

    // 关闭编辑器
    closeCustomScheduleEditor();

    // 刷新主题选择器(如果打开的话)
    const mainModal = document.getElementById("theme-selector-modal");
    if (mainModal && mainModal.classList.contains("show")) {
      renderAutoThemeContent();
    }
  } else {
    Utils.showToast("保存失败,请重试", "error");
  }
}

/**
 * 时间转换工具函数
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
