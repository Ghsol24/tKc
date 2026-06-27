/* ==========================================================================
   Focus Town - Application Main Entry Point (ES Module)
   Handles DOM Querying, UI Rendering, Event Bindings & SPA Routing
   ========================================================================== */

import {
  APP_STATE,
  PRESETS,
  TRANSLATIONS,
  saveData,
  loadLocalData,
  loadPreferencesFromStorage,
  bgmAudio
} from './js/state.js';

import {
  getBuildingName,
  getBuildingSVG,
  getWelcomeHeroSVG
} from './js/building.js';

import {
  doSignIn,
  doSignUp,
  doForgotPassword
} from './js/auth.js';

import {
  synth,
  setBGM,
  playBGM,
  startTimer,
  giveUpSession,
  executeGiveUp,
  registerUI
} from './js/timer.js';

/* ==========================================================================
   DOM SELECTORS
   ========================================================================== */

const DOM = {
  // Views
  viewWelcome: document.getElementById('view-welcome'),
  viewApp: document.getElementById('view-app'),

  // Welcome
  welcomeHeroSvg: document.getElementById('welcome-hero-svg'),
  btnGoSignup: document.getElementById('btn-go-signup'),
  btnGoLogin: document.getElementById('btn-go-login'),
  btnGuestMode: document.getElementById('btn-guest-mode'),
  btnPrevPreview: document.getElementById('btn-prev-preview'),
  btnNextPreview: document.getElementById('btn-next-preview'),
  previewModelName: document.getElementById('preview-model-name'),

  // Auth (Inside Morphing Card)
  authSignin: document.getElementById('auth-state-signin'),
  authSignup: document.getElementById('auth-state-signup'),
  authForgot: document.getElementById('auth-state-forgot'),
  formSignin: document.getElementById('form-signin'),
  formSignup: document.getElementById('form-signup'),
  formForgot: document.getElementById('form-forgot'),
  signinEmail: document.getElementById('signin-email'),
  signinPassword: document.getElementById('signin-password'),
  signupName: document.getElementById('signup-name'),
  signupEmail: document.getElementById('signup-email'),
  signupPassword: document.getElementById('signup-password'),
  forgotEmail: document.getElementById('forgot-email'),
  signinError: document.getElementById('signin-error'),
  signupError: document.getElementById('signup-error'),
  forgotResult: document.getElementById('forgot-result'),
  guestSyncNotice: document.getElementById('guest-sync-notice'),
  btnSwitchToSignup: document.getElementById('btn-switch-to-signup'),
  btnSwitchToSignin: document.getElementById('btn-switch-to-signin'),
  btnGoForgot: document.getElementById('btn-go-forgot'),
  btnBackToSignin: document.getElementById('btn-back-to-signin'),

  // App Header
  headerUser: document.getElementById('header-user'),
  userGreeting: document.getElementById('user-greeting'),
  btnLogout: document.getElementById('btn-logout'),

  // Tab buttons
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabFocus: document.getElementById('tab-focus'),
  tabTown: document.getElementById('tab-town'),
  tabProfile: document.getElementById('tab-profile'),

  // Focus Tab
  timeLeft: document.getElementById('time-left'),
  timerProgress: document.getElementById('timer-progress'),
  btnStart: document.getElementById('btn-start'),
  btnGiveUp: document.getElementById('btn-giveup'),
  activeSvgWrapper: document.getElementById('active-svg-wrapper'),
  buildingTitle: document.getElementById('building-title'),
  sessionBadge: document.getElementById('session-badge'),
  customSlider: {
    set disabled(val) {
      document.querySelectorAll('.time-picker-tab').forEach(btn => btn.disabled = val);
      document.querySelectorAll('.picker-chips button').forEach(btn => btn.disabled = val);
    }
  },
  timePickerTabs: document.querySelectorAll('.time-picker-tab'),
  timePresetTab: document.getElementById('tab-time-preset'),
  timeCustomTab: document.getElementById('tab-time-custom'),
  timePresetView: document.getElementById('time-preset-view'),
  timeCustomView: document.getElementById('time-custom-view'),
  pickerHoursChips: document.getElementById('picker-hours-chips'),
  pickerMinutesChips: document.getElementById('picker-minutes-chips'),
  pickerSummaryText: document.getElementById('picker-summary-text'),
  presetsGrid: document.getElementById('presets-grid'),
  soundButtons: document.querySelectorAll('.btn-sound'),
  timerPhase: document.getElementById('timer-phase'),
  focusCardContainer: document.getElementById('focus-card-container'),
  btnFocusPause: document.getElementById('btn-focus-pause'),
  btnFocusStop: document.getElementById('btn-focus-stop'),
  focusTimeDisplay: document.getElementById('focus-time-display'),
  miniProgressBarFill: document.getElementById('mini-progress-bar-fill'),
  normalStagePlaceholder: document.getElementById('normal-stage-placeholder'),
  focusStagePlaceholder: document.getElementById('focus-stage-placeholder'),
  constructionStage: document.getElementById('construction-stage'),
  floatingBuildBadge: document.getElementById('floating-build-badge'),
  floatingBadgeIcon: document.getElementById('floating-badge-icon'),
  floatingBadgeText: document.getElementById('floating-badge-text'),

  // Quick Stats
  themesGrid: document.getElementById('themes-grid'),
  themeSelectButtons: document.querySelectorAll('.btn-theme-select'),
  statTotalTime: document.getElementById('stat-total-time'),
  statCompletedCount: document.getElementById('stat-completed-count'),
  statFailedCount: document.getElementById('stat-failed-count'),
  workspaceStatTime: document.getElementById('workspace-stat-time'),
  workspaceStatCompleted: document.getElementById('workspace-stat-completed'),
  workspaceStatBuildings: document.getElementById('workspace-stat-buildings'),

  // Town Tab
  townGrid: document.getElementById('town-grid'),
  btnResetTown: document.getElementById('btn-reset-town'),

  // Profile Tab
  profileAvatar: document.getElementById('profile-avatar'),
  profileName: document.getElementById('profile-name'),
  profileEmail: document.getElementById('profile-email'),
  profileModeBadge: document.getElementById('profile-mode-badge'),
  profileStatTime: document.getElementById('profile-stat-time'),
  profileStatCompleted: document.getElementById('profile-stat-completed'),
  profileStatFailed: document.getElementById('profile-stat-failed'),
  profileStatBuildings: document.getElementById('profile-stat-buildings'),
  profileAccountCard: document.getElementById('profile-account-card'),

  // Settings
  btnSettingsTrigger: document.getElementById('btn-settings-trigger'),
  btnSettingsClose: document.getElementById('btn-settings-close'),
  settingsOverlay: document.getElementById('settings-overlay'),
  settingsPanel: document.getElementById('settings-panel'),
  themeButtons: document.querySelectorAll('.btn-theme'),
  screenDimmer: document.getElementById('screen-dimmer'),
  brightnessSlider: document.getElementById('brightness-slider'),
  brightnessValue: document.getElementById('brightness-value'),
  langButtons: document.querySelectorAll('.btn-lang'),
  bgmSelector: document.getElementById('bgm-selector'),
  bgmVolume: document.getElementById('bgm-volume'),
  bgmVolValue: document.getElementById('bgm-vol-value'),

  // Modals
  modalCompletion: document.getElementById('modal-completion'),
  modalMessage: document.getElementById('modal-message'),
  btnModalClose: document.getElementById('btn-modal-close'),
  modalConfirmGiveUp: document.getElementById('modal-confirm-giveup'),
  btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
  btnConfirmOk: document.getElementById('btn-confirm-ok'),

  // Building Flyout
  mainLayout: document.getElementById('main-layout'),
  appContainerMain: document.querySelector('#view-app .app-container'),
  buildingFlyoutCard: document.getElementById('building-flyout-card'),
  btnBuildingTrigger: document.getElementById('btn-selected-building-trigger'),
  btnFlyoutClose: document.getElementById('btn-flyout-close'),
  selectedBuildingIcon: document.getElementById('selected-building-icon'),
  selectedBuildingName: document.getElementById('selected-building-name'),
  selectedBuildingDesc: document.getElementById('selected-building-desc'),
  triggerTriangle: document.getElementById('trigger-triangle'),
};

// Register DOM and core UI methods to the timer module to prevent circular importing
registerUI(DOM, { updateTimerDisplay, updateStatsUI, renderTownGrid });

/* ==========================================================================
   VIEW ROUTER (SPA)
   ========================================================================== */

function switchView(viewId) {
  if (viewId === 'auth') {
    viewId = 'welcome';
  }

  const update = () => {
    DOM.viewWelcome.classList.add('hidden');
    DOM.viewApp.classList.add('hidden');

    if (viewId === 'welcome') DOM.viewWelcome.classList.remove('hidden');
    else if (viewId === 'app')    DOM.viewApp.classList.remove('hidden');

    APP_STATE.currentView = viewId;
  };

  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

function switchTab(tabId) {
  const update = () => {
    DOM.tabBtns.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const panels = [DOM.tabFocus, DOM.tabTown, DOM.tabProfile];
    panels.forEach(panel => {
      if (panel) {
        const active = panel.id === `tab-${tabId}`;
        panel.classList.toggle('hidden', !active);
      }
    });

    APP_STATE.activeTab = tabId;

    if (tabId === 'town') renderTownGrid();
    if (tabId === 'profile') renderProfileTab();
  };

  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

/* ==========================================================================
   SESSION STATE HANDLERS
   ========================================================================== */

function updateAvatarUI() {
  const headerImg = document.getElementById('header-avatar-img');
  const headerFallback = document.getElementById('header-avatar-fallback');
  const profileImg = document.getElementById('profile-avatar-img');
  const profileFallback = document.getElementById('profile-avatar');

  if (APP_STATE.isGuest || !APP_STATE.currentUser || !APP_STATE.currentUser.avatar) {
    if (headerImg) headerImg.classList.add('hidden');
    if (headerFallback) headerFallback.classList.remove('hidden');
    if (profileImg) profileImg.classList.add('hidden');
    if (profileFallback) profileFallback.classList.remove('hidden');
  } else {
    const avatarSrc = APP_STATE.currentUser.avatar;
    if (headerImg) {
      headerImg.src = avatarSrc;
      headerImg.classList.remove('hidden');
    }
    if (headerFallback) headerFallback.classList.add('hidden');
    if (profileImg) {
      profileImg.src = avatarSrc;
      profileImg.classList.remove('hidden');
    }
    if (profileFallback) profileFallback.classList.add('hidden');
  }
}

function enterApp(user, token) {
  if (user) {
    APP_STATE.currentUser = user;
    APP_STATE.isGuest = false;
    APP_STATE.stats = user.stats || { totalMinutes: 0, completedCount: 0, failedCount: 0 };
    APP_STATE.buildings = user.buildings || [];
    localStorage.setItem(`focus_town_data_${user.email}`, JSON.stringify({ stats: APP_STATE.stats, buildings: APP_STATE.buildings, avatar: user.avatar || '' }));
    if (token) {
      localStorage.setItem('focus_town_token', token);
    }
  } else {
    APP_STATE.currentUser = null;
    APP_STATE.isGuest = true;
    loadLocalData();
  }

  localStorage.setItem('focus_town_session', JSON.stringify({ email: user?.email || null, name: user?.name || '' }));

  updateHeaderUser();
  updateAvatarUI();
  applyLanguage(APP_STATE.lang);
  switchView('app');
  switchTab('focus');
}

function logoutUser() {
  saveData();
  APP_STATE.currentUser = null;
  APP_STATE.isGuest = true;
  APP_STATE.stats = { totalMinutes: 0, completedCount: 0, failedCount: 0 };
  APP_STATE.buildings = [];
  localStorage.removeItem('focus_town_session');
  localStorage.removeItem('focus_town_token');
  if (APP_STATE.timerInterval) clearInterval(APP_STATE.timerInterval);
  APP_STATE.isRunning = false;
  APP_STATE.isPaused = false;
  document.body.classList.remove('focus-active');
  synth.stop();
  bgmAudio.pause();
  updateAvatarUI();
  switchView('welcome');
}

function updateHeaderUser() {
  const lang = APP_STATE.lang;
  if (APP_STATE.isGuest) {
    DOM.userGreeting.textContent = lang === 'vi' ? 'Xin chào, Khách!' : 'Hello, Guest!';
  } else {
    const name = APP_STATE.currentUser.name || APP_STATE.currentUser.email;
    DOM.userGreeting.textContent = lang === 'vi' ? `Chào ${name}!` : `Hello, ${name}!`;
  }
}

/* ==========================================================================
   UI RENDERING METHODS
   ========================================================================== */

/* ---- Building Flyout Trigger Sync ---- */
const BUILDING_ICONS = {
  tent: '🏕️',
  cafe: '☕',
  stadium: '🏟️',
  library: '📚',
  campus: '🏫',
  observatory: '🔭',
  lighthouse: '🚨',
  berlin: '🏛️'
};

function updateBuildingTrigger() {
  const lang = APP_STATE.lang;
  const type = APP_STATE.selectedBuilding || 'tent';
  const themeKey = type.charAt(0).toUpperCase() + type.slice(1);
  const t = TRANSLATIONS[lang] || TRANSLATIONS['vi'];

  if (DOM.selectedBuildingIcon) DOM.selectedBuildingIcon.textContent = BUILDING_ICONS[type] || '🏕️';
  if (DOM.selectedBuildingName) DOM.selectedBuildingName.textContent = t['theme' + themeKey] || type;
  if (DOM.selectedBuildingDesc) DOM.selectedBuildingDesc.textContent = t['themeDesc' + themeKey] || '';

  // Disable trigger while timer is running
  if (DOM.btnBuildingTrigger) {
    DOM.btnBuildingTrigger.disabled = !!APP_STATE.isRunning;
  }
}

function openBuildingFlyout() {
  if (!DOM.buildingFlyoutCard || !DOM.mainLayout) return;
  DOM.buildingFlyoutCard.classList.remove('hidden');
  DOM.mainLayout.classList.add('flyout-open');
  if (DOM.appContainerMain) DOM.appContainerMain.classList.add('flyout-open');
  if (DOM.btnBuildingTrigger) {
    DOM.btnBuildingTrigger.classList.add('flyout-active');
    DOM.btnBuildingTrigger.setAttribute('aria-expanded', 'true');
  }
}

function closeBuildingFlyout() {
  if (!DOM.buildingFlyoutCard || !DOM.mainLayout) return;
  DOM.buildingFlyoutCard.classList.add('hidden');
  DOM.mainLayout.classList.remove('flyout-open');
  if (DOM.appContainerMain) DOM.appContainerMain.classList.remove('flyout-open');
  if (DOM.btnBuildingTrigger) {
    DOM.btnBuildingTrigger.classList.remove('flyout-active');
    DOM.btnBuildingTrigger.setAttribute('aria-expanded', 'false');
  }
}

function toggleBuildingFlyout() {
  if (!DOM.buildingFlyoutCard) return;
  if (DOM.buildingFlyoutCard.classList.contains('hidden')) {
    openBuildingFlyout();
  } else {
    closeBuildingFlyout();
  }
}

function updateUnlockedBuildings() {
  const lang = APP_STATE.lang;
  const completedCount = APP_STATE.stats.completedCount || 0;

  const thresholds = {
    tent: 0,
    cafe: 0,
    stadium: 0,
    library: 2,
    campus: 4,
    observatory: 6,
    lighthouse: 8,
    berlin: 10
  };

  DOM.themeSelectButtons.forEach(btn => {
    const theme = btn.dataset.theme;
    const required = thresholds[theme] || 0;
    const isUnlocked = completedCount >= required;

    btn.disabled = !isUnlocked;

    const themeKey = theme.charAt(0).toUpperCase() + theme.slice(1);
    const nameEl = btn.querySelector('.theme-name');
    const descEl = btn.querySelector('.theme-desc');

    if (nameEl && descEl && TRANSLATIONS[lang]) {
      const nameText = TRANSLATIONS[lang]['theme' + themeKey] || theme;
      const descTranslationKey = 'themeDesc' + themeKey;

      if (isUnlocked) {
        nameEl.textContent = nameText;
        descEl.textContent = TRANSLATIONS[lang][descTranslationKey] || '';
      } else {
        nameEl.textContent = `🔒 ${nameText}`;
        const lockedFormat = TRANSLATIONS[lang].buildingLockedDesc || '🔒 Hoàn thành {count} công trình';
        descEl.textContent = lockedFormat.replace('{count}', required);
      }
    }

    // Reset user selection if it somehow points to a locked building
    if (!isUnlocked && APP_STATE.selectedBuilding === theme) {
      APP_STATE.selectedBuilding = 'tent';
      localStorage.setItem('focus_town_selected_building', 'tent');
      DOM.themeSelectButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'tent'));
      APP_STATE.lastRenderedKey = null;
      updateTimerDisplay();
    }
  });

  // Keep trigger button in sync after unlock state changes
  updateBuildingTrigger();
}

function updateStatsUI() {
  if (DOM.statTotalTime) DOM.statTotalTime.textContent = APP_STATE.stats.totalMinutes;
  if (DOM.statCompletedCount) DOM.statCompletedCount.textContent = APP_STATE.stats.completedCount;
  if (DOM.statFailedCount) DOM.statFailedCount.textContent = APP_STATE.stats.failedCount;

  if (DOM.workspaceStatTime) DOM.workspaceStatTime.textContent = APP_STATE.stats.totalMinutes;
  if (DOM.workspaceStatCompleted) DOM.workspaceStatCompleted.textContent = APP_STATE.stats.completedCount;
  if (DOM.workspaceStatBuildings) DOM.workspaceStatBuildings.textContent = APP_STATE.buildings.filter(b => b.status === 'completed').length;

  updateUnlockedBuildings();
}

function updateTimerDisplay() {
  const lang = APP_STATE.lang;
  const mins = Math.floor(APP_STATE.timeLeft / 60);
  const secs = APP_STATE.timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  DOM.timeLeft.textContent = formattedTime;
  if (DOM.focusTimeDisplay) DOM.focusTimeDisplay.textContent = formattedTime;

  const total = APP_STATE.durationSeconds;
  const elapsed = total - APP_STATE.timeLeft;
  const pct = total > 0 ? elapsed / total : 0;
  DOM.timerProgress.style.strokeDashoffset = 565.48 * (1 - pct);
  if (DOM.miniProgressBarFill) DOM.miniProgressBarFill.style.width = `${pct * 100}%`;

  const durationMins = Math.round(APP_STATE.durationSeconds / 60);
  const type = APP_STATE.selectedBuilding;
  
  // Tối ưu hóa DOM Thrashing: Chỉ kích hoạt render SVG khi bước tiến trình thay đổi 5%
  // Chia nhỏ thành 20 mốc (mỗi mốc 5%)
  const pctStep = Math.floor(pct * 20) * 5; 
  const renderKey = `${type}_${APP_STATE.isRunning}_${APP_STATE.isPaused}_${pctStep}`;
  
  if (APP_STATE.lastRenderedKey !== renderKey) {
    DOM.activeSvgWrapper.innerHTML = getBuildingSVG(type, pct, 'completed', APP_STATE.isPaused, durationMins);
    APP_STATE.lastRenderedKey = renderKey;
  }

  if (APP_STATE.isRunning) {
    DOM.sessionBadge.textContent = TRANSLATIONS[lang].buildingBadge;
    DOM.sessionBadge.classList.add('active');
    DOM.buildingTitle.textContent = getBuildingName(type);
  } else {
    DOM.sessionBadge.textContent = TRANSLATIONS[lang].readyBadge;
    DOM.sessionBadge.classList.remove('active');
    DOM.buildingTitle.textContent = TRANSLATIONS[lang].emptyLand;
  }

  // Update floating prepare badge
  if (DOM.floatingBuildBadge) {
    if (APP_STATE.isRunning) {
      DOM.floatingBuildBadge.classList.add('hidden');
    } else {
      DOM.floatingBuildBadge.classList.remove('hidden');
      if (DOM.floatingBadgeIcon) {
        const icons = {
          tent: '🏕️',
          cafe: '☕',
          stadium: '🏟️',
          library: '📚',
          campus: '🏫',
          observatory: '🔭',
          lighthouse: '🚨',
          berlin: '🏛️'
        };
        DOM.floatingBadgeIcon.textContent = icons[type] || '🏕️';
      }
      if (DOM.floatingBadgeText) {
        const prepareText = lang === 'vi' ? 'Chuẩn bị xây' : 'Preparing';
        DOM.floatingBadgeText.textContent = `${prepareText}: ${getBuildingName(type)}`;
      }
    }
  }
}

function renderTownGrid() {
  DOM.townGrid.innerHTML = '';
  const lang = APP_STATE.lang;
  for (let i = 0; i < 32; i++) {
    const plot = document.createElement('div');
    plot.className = 'town-plot';
    plot.dataset.index = i;
    const b = APP_STATE.buildings.find(item => item.gridIndex === i);
    if (b) {
      plot.innerHTML = getBuildingSVG(b.type, 1.0, b.status, false, b.duration);
      const name = b.status === 'completed' ? getBuildingName(b.type) : TRANSLATIONS[lang].ruin;
      const tooltip = TRANSLATIONS[lang].plotTooltipBuilding
        .replace('{name}', name).replace('{min}', b.duration).replace('{date}', b.date);
      plot.setAttribute('data-tooltip', tooltip);
    } else {
      plot.setAttribute('data-tooltip', TRANSLATIONS[lang].plotTooltipEmpty);
    }
    DOM.townGrid.appendChild(plot);
  }
}

function renderProfileTab() {
  const lang = APP_STATE.lang;
  DOM.profileStatTime.textContent = APP_STATE.stats.totalMinutes;
  DOM.profileStatCompleted.textContent = APP_STATE.stats.completedCount;
  DOM.profileStatFailed.textContent = APP_STATE.stats.failedCount;
  DOM.profileStatBuildings.textContent = APP_STATE.buildings.filter(b => b.status === 'completed').length;

  updateAvatarUI();

  if (APP_STATE.isGuest) {
    DOM.profileName.textContent = lang === 'vi' ? 'Người dùng Khách' : 'Guest User';
    DOM.profileEmail.textContent = 'guest@focustown.local';
    DOM.profileModeBadge.textContent = TRANSLATIONS[lang].profileModeGuest;
    DOM.profileAccountCard.innerHTML = `
      <div class="upgrade-prompt">
        <h3>${TRANSLATIONS[lang].upgradeTitle}</h3>
        <p>${TRANSLATIONS[lang].upgradeDesc}</p>
        <div class="upgrade-actions">
          <button class="btn btn-primary" id="profile-btn-signup">${TRANSLATIONS[lang].btnSignUp}</button>
          <button class="btn btn-secondary" id="profile-btn-login">${TRANSLATIONS[lang].btnSignIn}</button>
        </div>
      </div>`;
    document.getElementById('profile-btn-signup')?.addEventListener('click', () => { switchView('auth'); showAuthPanel('auth-signup'); });
    document.getElementById('profile-btn-login')?.addEventListener('click', () => { switchView('auth'); showAuthPanel('auth-signin'); });
  } else {
    const user = APP_STATE.currentUser;
    DOM.profileName.textContent = user.name || (lang === 'vi' ? 'Người dùng' : 'User');
    DOM.profileEmail.textContent = user.email || '';
    DOM.profileModeBadge.textContent = TRANSLATIONS[lang].profileModeAccount;
    DOM.profileAccountCard.innerHTML = `
      <h3 class="card-title-h3" style="font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:700;color:var(--color-primary-dark);margin-bottom:0.75rem;">${TRANSLATIONS[lang].profileActionsTitle}</h3>
      <button class="btn btn-danger" id="profile-btn-logout">${TRANSLATIONS[lang].btnLogout}</button>`;
    document.getElementById('profile-btn-logout')?.addEventListener('click', logoutUser);
  }
}

function renderPresets() {
  DOM.presetsGrid.innerHTML = '';
  const lang = APP_STATE.lang;
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = `btn-preset ${APP_STATE.activePreset === p.minutes ? 'active' : ''}`;
    btn.dataset.minutes = p.minutes;
    btn.disabled = APP_STATE.isRunning;
    const descText = lang === 'vi' ? p.keyVi : p.keyEn;
    const descMin = lang === 'vi' ? `${p.minutes} phút` : `${p.minutes} mins`;
    btn.innerHTML = `${descMin} <span class="preset-desc">${descText}</span>`;
    btn.addEventListener('click', () => {
      if (APP_STATE.isRunning) return;
      document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      APP_STATE.activePreset = p.minutes;
      APP_STATE.durationSeconds = p.minutes * 60;
      APP_STATE.timeLeft = p.minutes * 60;
      
      // Synchronize hours and minutes to picker
      APP_STATE.customHours = Math.floor(p.minutes / 60);
      APP_STATE.customMinutes = p.minutes % 60;
      renderCustomPicker();
      
      updateTimerDisplay();
    });
    DOM.presetsGrid.appendChild(btn);
  });
}

function renderCustomPicker() {
  if (!DOM.pickerHoursChips || !DOM.pickerMinutesChips) return;
  
  // Render Hours Chips: 0, 1, 2, 3
  DOM.pickerHoursChips.innerHTML = '';
  [0, 1, 2, 3].forEach(h => {
    const btn = document.createElement('button');
    btn.className = `chip-btn ${APP_STATE.customHours === h ? 'active' : ''}`;
    btn.textContent = h;
    btn.disabled = APP_STATE.isRunning;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', APP_STATE.customHours === h ? 'true' : 'false');
    btn.addEventListener('click', () => {
      if (APP_STATE.isRunning) return;
      APP_STATE.customHours = h;
      
      // Auto-correct 0h and 0m: if hours is 0 and minutes is 0, set minutes to 5
      if (APP_STATE.customHours === 0 && APP_STATE.customMinutes === 0) {
        APP_STATE.customMinutes = 5;
      }
      
      applyCustomTime();
    });
    DOM.pickerHoursChips.appendChild(btn);
  });
  
  // Render Minutes Chips: 0, 5, 10, 15, 20, 30, 45
  DOM.pickerMinutesChips.innerHTML = '';
  [0, 5, 10, 15, 20, 30, 45].forEach(m => {
    const btn = document.createElement('button');
    btn.className = `chip-btn ${APP_STATE.customMinutes === m ? 'active' : ''}`;
    btn.textContent = m;
    
    // Disable '0' minute chip if hour is '0'
    const isZeroZero = APP_STATE.customHours === 0 && m === 0;
    btn.disabled = APP_STATE.isRunning || isZeroZero;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', APP_STATE.customMinutes === m ? 'true' : 'false');
    
    btn.addEventListener('click', () => {
      if (APP_STATE.isRunning || isZeroZero) return;
      APP_STATE.customMinutes = m;
      applyCustomTime();
    });
    DOM.pickerMinutesChips.appendChild(btn);
  });
  
  updateSummaryBadge();
}

function applyCustomTime() {
  const totalMins = APP_STATE.customHours * 60 + APP_STATE.customMinutes;
  APP_STATE.durationSeconds = totalMins * 60;
  APP_STATE.timeLeft = totalMins * 60;
  APP_STATE.activePreset = null; // Clear active preset since we customized it
  
  // Clear active preset buttons
  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
  
  renderCustomPicker();
  updateTimerDisplay();
}

function updateSummaryBadge() {
  if (!DOM.pickerSummaryText) return;
  const lang = APP_STATE.lang;
  const h = APP_STATE.customHours;
  const m = APP_STATE.customMinutes;
  
  let summaryText = "";
  if (lang === 'vi') {
    if (h > 0 && m > 0) {
      summaryText = `${h} giờ ${m} phút (${h * 60 + m} phút)`;
    } else if (h > 0) {
      summaryText = `${h} giờ (${h * 60} phút)`;
    } else {
      summaryText = `${m} phút`;
    }
  } else {
    // English translation
    const hStr = h === 1 ? 'hour' : 'hours';
    const mStr = m === 1 ? 'min' : 'mins';
    if (h > 0 && m > 0) {
      summaryText = `${h} ${hStr} ${m} ${mStr} (${h * 60 + m} mins)`;
    } else if (h > 0) {
      summaryText = `${h} ${hStr} (${h * 60} mins)`;
    } else {
      summaryText = `${m} ${mStr}`;
    }
  }
  
  DOM.pickerSummaryText.textContent = summaryText;
}

function applyLanguage(lang) {
  APP_STATE.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  const pauseTextEl = document.getElementById('text-focus-pause');
  if (pauseTextEl) {
    pauseTextEl.textContent = APP_STATE.isPaused ? TRANSLATIONS[lang].btnFocusResume : TRANSLATIONS[lang].btnFocusPause;
  }

  DOM.langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderPresets();
  renderCustomPicker();

  const val = parseInt(DOM.brightnessSlider.value);
  if (val === 0) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerBrightest;
  else if (val <= 20) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDim1;
  else if (val <= 45) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDim2;
  else DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDarkest;

  updateHeaderUser();
  updateTimerDisplay();
  updateStatsUI();
  updateBuildingTrigger();
  if (typeof updateWelcomePreview === 'function') {
    updateWelcomePreview();
  }
}

function applyPreferencesToDOM() {
  const { themeSaved, brightnessSaved, bgmSaved, bgmVolSaved } = loadPreferencesFromStorage();

  if (themeSaved) {
    document.body.className = '';
    if (themeSaved !== 'cream') document.body.classList.add(`theme-${themeSaved}`);
    DOM.themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeSaved);
    });
  }

  const dimVal = brightnessSaved !== null ? parseInt(brightnessSaved) : 0;
  DOM.brightnessSlider.value = dimVal;
  DOM.screenDimmer.style.opacity = dimVal / 100;

  if (bgmSaved) {
    DOM.bgmSelector.value = bgmSaved;
  }

  if (bgmVolSaved !== null) {
    const volPct = Math.round(APP_STATE.bgmVolume * 100);
    DOM.bgmVolume.value = volPct;
    DOM.bgmVolValue.textContent = `${volPct}%`;
  }

  const themeSelectedSaved = localStorage.getItem('focus_town_selected_building');
  if (themeSelectedSaved) {
    APP_STATE.selectedBuilding = themeSelectedSaved;
    DOM.themeSelectButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeSelectedSaved);
    });
  }

  // Sync trigger button display
  updateBuildingTrigger();
}

/* ==========================================================================
   AUTH FORM SWITCHER
   ========================================================================== */

function showAuthPanel(panelId) {
  const state = panelId.replace('auth-', '');
  const states = ['welcome', 'signin', 'signup', 'forgot'];
  states.forEach(s => {
    const el = document.getElementById(`auth-state-${s}`);
    if (el) el.classList.add('hidden');
  });

  const activeEl = document.getElementById(`auth-state-${state}`);
  if (activeEl) {
    activeEl.classList.remove('hidden');
    activeEl.style.animation = 'none';
    activeEl.offsetHeight; // trigger reflow
    activeEl.style.animation = 'cardMorphIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both';
  }

  if (state === 'signup') {
    const guestRaw = localStorage.getItem('focus_town_data_guest');
    if (guestRaw) {
      try {
        const data = JSON.parse(guestRaw);
        const hasProgress = data && data.buildings && data.buildings.length > 0;
        DOM.guestSyncNotice.classList.toggle('hidden', !hasProgress);
      } catch (e) {
        console.error('Error parsing guestRaw', e);
        DOM.guestSyncNotice.classList.add('hidden');
      }
    } else {
      DOM.guestSyncNotice.classList.add('hidden');
    }
  }
}

/* ==========================================================================
   EVENT BINDINGS & LISTENERS
   ========================================================================== */

// Password Toggles
document.querySelectorAll('.btn-show-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isPassword = target.type === 'password';
    target.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁';
  });
});

// SPA View switching click events
DOM.btnSwitchToSignup.addEventListener('click', () => showAuthPanel('auth-signup'));
DOM.btnSwitchToSignin.addEventListener('click', () => showAuthPanel('auth-signin'));
DOM.btnGoForgot.addEventListener('click', () => showAuthPanel('auth-forgot'));
DOM.btnBackToSignin.addEventListener('click', () => showAuthPanel('auth-signin'));

DOM.btnGoSignup.addEventListener('click', () => showAuthPanel('auth-signup'));
DOM.btnGoLogin.addEventListener('click', () => showAuthPanel('auth-signin'));
DOM.btnGuestMode.addEventListener('click', () => {
  console.log('Guest Mode button clicked!');
  try {
    enterApp(null);
  } catch (e) {
    console.error('Error in enterApp:', e);
  }
});

document.getElementById('btn-back-welcome-signin')?.addEventListener('click', () => showAuthPanel('auth-welcome'));
document.getElementById('btn-back-welcome-signup')?.addEventListener('click', () => showAuthPanel('auth-welcome'));
document.getElementById('btn-back-welcome-forgot')?.addEventListener('click', () => showAuthPanel('auth-welcome'));

DOM.btnLogout.addEventListener('click', logoutUser);

DOM.tabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Authentication Submissions
DOM.formSignin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = DOM.signinEmail.value.trim();
  const password = DOM.signinPassword.value;

  if (!email || !password) {
    DOM.signinError.textContent = APP_STATE.lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all fields';
    DOM.signinError.className = 'auth-message error';
    return;
  }

  const btn = document.getElementById('btn-signin-submit');
  btn.disabled = true;
  btn.textContent = '...';
  DOM.signinError.className = 'auth-message hidden';

  const result = await doSignIn(email, password);
  btn.disabled = false;
  btn.textContent = TRANSLATIONS[APP_STATE.lang].btnSignIn;

  if (!result.ok) {
    DOM.signinError.textContent = result.message;
    DOM.signinError.className = 'auth-message error';
    return;
  }
  enterApp(result.user);
});

DOM.formSignup.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = DOM.signupName.value.trim();
  const email = DOM.signupEmail.value.trim();
  const password = DOM.signupPassword.value;

  if (!email || !password) {
    DOM.signupError.textContent = APP_STATE.lang === 'vi' ? 'Vui lòng điền đầy đủ Email và Mật khẩu' : 'Please fill in Email and Password';
    DOM.signupError.className = 'auth-message error';
    return;
  }
  if (password.length < 6) {
    DOM.signupError.textContent = APP_STATE.lang === 'vi' ? 'Mật khẩu phải có ít nhất 6 ký tự' : 'Password must be at least 6 characters';
    DOM.signupError.className = 'auth-message error';
    return;
  }

  const btn = document.getElementById('btn-signup-submit');
  btn.disabled = true;
  btn.textContent = '...';
  DOM.signupError.className = 'auth-message hidden';

  const result = await doSignUp(name, email, password);
  btn.disabled = false;
  btn.textContent = TRANSLATIONS[APP_STATE.lang].btnSignUp;

  if (!result.ok) {
    DOM.signupError.textContent = result.message;
    DOM.signupError.className = 'auth-message error';
    return;
  }
  enterApp(result.user);
});

DOM.formForgot.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = DOM.forgotEmail.value.trim();
  if (!email) {
    DOM.forgotResult.textContent = APP_STATE.lang === 'vi' ? 'Vui lòng nhập Email' : 'Please enter your email';
    DOM.forgotResult.className = 'auth-message error';
    return;
  }

  const btn = document.getElementById('btn-forgot-submit');
  btn.disabled = true;
  btn.textContent = '...';
  DOM.forgotResult.className = 'auth-message hidden';

  const result = await doForgotPassword(email);
  btn.disabled = false;
  btn.textContent = TRANSLATIONS[APP_STATE.lang].btnRecoverPassword;

  if (!result.ok) {
    DOM.forgotResult.textContent = result.message;
    DOM.forgotResult.className = 'auth-message error';
    return;
  }

  const greeting = result.name ? (APP_STATE.lang === 'vi' ? `Xin chào <strong>${result.name}</strong>!<br>` : `Hello <strong>${result.name}</strong>!<br>`) : '';
  DOM.forgotResult.innerHTML = APP_STATE.lang === 'vi'
    ? `${greeting}Mật khẩu của bạn là: <strong style="font-size:1.1em;letter-spacing:0.05em;">${result.password}</strong>`
    : `${greeting}Your password is: <strong style="font-size:1.1em;letter-spacing:0.05em;">${result.password}</strong>`;
  DOM.forgotResult.className = 'auth-message success';
});

// Time Selector Tab Switching
DOM.timePickerTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (APP_STATE.isRunning) return;

    // Lock scroll position before DOM changes
    const scrollY = window.scrollY;

    DOM.timePickerTabs.forEach(t => {
      const isActive = t === tab;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const mode = tab.dataset.mode;
    APP_STATE.timeSelectionMode = mode;

    if (mode === 'preset') {
      DOM.timePresetView.classList.remove('hidden');
      DOM.timeCustomView.classList.add('hidden');
    } else {
      DOM.timePresetView.classList.add('hidden');
      DOM.timeCustomView.classList.remove('hidden');
      renderCustomPicker();
    }

    // Restore scroll position after DOM layout reflow
    requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
  });
});

// Sound Selection
DOM.soundButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    DOM.soundButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    synth.setSound(btn.dataset.sound);
  });
});

// Building Theme Selection
DOM.themeSelectButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (APP_STATE.isRunning) return;
    DOM.themeSelectButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.dataset.theme;
    APP_STATE.selectedBuilding = theme;
    localStorage.setItem('focus_town_selected_building', theme);
    APP_STATE.lastRenderedKey = null;
    updateTimerDisplay();
    // Update trigger button display to reflect new selection
    updateBuildingTrigger();
    // Auto-close the flyout after selection
    closeBuildingFlyout();
  });
});

DOM.btnStart.addEventListener('click', startTimer);
DOM.btnGiveUp.addEventListener('click', giveUpSession);

// Focus Pause & Stop
if (DOM.btnFocusPause) {
  DOM.btnFocusPause.addEventListener('click', () => {
    if (!APP_STATE.isRunning) return;
    APP_STATE.isPaused = !APP_STATE.isPaused;
    const pauseTextEl = document.getElementById('text-focus-pause');
    const pauseIconEl = document.getElementById('icon-focus-pause');
    if (APP_STATE.isPaused) {
      if (pauseTextEl) pauseTextEl.textContent = TRANSLATIONS[APP_STATE.lang].btnFocusResume;
      if (pauseIconEl) pauseIconEl.textContent = '▶️';
      synth.stop();
      if (bgmAudio && !bgmAudio.paused) bgmAudio.pause();
    } else {
      if (pauseTextEl) pauseTextEl.textContent = TRANSLATIONS[APP_STATE.lang].btnFocusPause;
      if (pauseIconEl) pauseIconEl.textContent = '⏸️';
      synth.setSound(synth.currentType);
      if (APP_STATE.bgmActive !== 'off' && bgmAudio && bgmAudio.paused) bgmAudio.play().catch(()=>{});
    }
    APP_STATE.lastRenderedKey = null;
    updateTimerDisplay();
  });
}

if (DOM.btnFocusStop) DOM.btnFocusStop.addEventListener('click', giveUpSession);

DOM.btnModalClose.addEventListener('click', () => {
  DOM.modalCompletion.classList.add('hidden');
  switchTab('town');
});

DOM.btnConfirmCancel.addEventListener('click', () => DOM.modalConfirmGiveUp.classList.add('hidden'));
DOM.btnConfirmOk.addEventListener('click', () => { DOM.modalConfirmGiveUp.classList.add('hidden'); executeGiveUp(); });

DOM.btnResetTown.addEventListener('click', () => {
  const confirmReset = confirm(TRANSLATIONS[APP_STATE.lang].confirmReset);
  if (!confirmReset) return;
  APP_STATE.stats = { totalMinutes: 0, completedCount: 0, failedCount: 0 };
  APP_STATE.buildings = [];
  saveData();
  updateStatsUI();
  renderTownGrid();
  updateTimerDisplay();
});

// UI Settings Panel Events
DOM.btnSettingsTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = DOM.settingsPanel.classList.toggle('hidden');
  if (isHidden) DOM.settingsOverlay.classList.add('hidden');
  else DOM.settingsOverlay.classList.remove('hidden');
});

DOM.settingsOverlay.addEventListener('click', () => {
  DOM.settingsPanel.classList.add('hidden');
  DOM.settingsOverlay.classList.add('hidden');
});

// Issue #9: X close button inside settings panel header
if (DOM.btnSettingsClose) {
  DOM.btnSettingsClose.addEventListener('click', () => {
    DOM.settingsPanel.classList.add('hidden');
    DOM.settingsOverlay.classList.add('hidden');
  });
}

document.addEventListener('click', (e) => {
  const welcomeGear = document.getElementById('welcome-gear-btn');
  // Close settings panel when clicking outside
  if (!DOM.settingsPanel.classList.contains('hidden') &&
      !DOM.settingsPanel.contains(e.target) &&
      e.target !== DOM.btnSettingsTrigger &&
      e.target !== welcomeGear &&
      (!welcomeGear || !welcomeGear.contains(e.target)) &&
      e.target !== DOM.settingsOverlay) {
    DOM.settingsPanel.classList.add('hidden');
    DOM.settingsOverlay.classList.add('hidden');
  }
  // Note: Building flyout only closes via X button, building selection, Escape, or timer start
});

// Flyout open/close via trigger button
if (DOM.btnBuildingTrigger) {
  DOM.btnBuildingTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (APP_STATE.isRunning) return;
    toggleBuildingFlyout();
  });
}

// Close flyout via X button inside flyout header
if (DOM.btnFlyoutClose) {
  DOM.btnFlyoutClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBuildingFlyout();
  });
}

// Escape key: close flyout (or settings if open)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (DOM.buildingFlyoutCard && !DOM.buildingFlyoutCard.classList.contains('hidden')) {
      closeBuildingFlyout();
    }
    if (DOM.settingsPanel && !DOM.settingsPanel.classList.contains('hidden')) {
      DOM.settingsPanel.classList.add('hidden');
      DOM.settingsOverlay.classList.add('hidden');
    }
  }
});

DOM.themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    DOM.themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.dataset.theme;
    document.body.className = '';
    if (theme !== 'cream') document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('focus_town_theme', theme);
  });
});

DOM.brightnessSlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  const lang = APP_STATE.lang;
  DOM.screenDimmer.style.opacity = val / 100;
  if (val === 0) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerBrightest;
  else if (val <= 20) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDim1;
  else if (val <= 45) DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDim2;
  else DOM.brightnessValue.textContent = TRANSLATIONS[lang].dimmerDarkest;
  localStorage.setItem('focus_town_brightness', val);
});

DOM.langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    localStorage.setItem('focus_town_lang', lang);
    applyLanguage(lang);
  });
});

document.getElementById('welcome-lang-vi')?.addEventListener('click', () => {
  localStorage.setItem('focus_town_lang', 'vi');
  applyLanguage('vi');
});

document.getElementById('welcome-lang-en')?.addEventListener('click', () => {
  localStorage.setItem('focus_town_lang', 'en');
  applyLanguage('en');
  document.getElementById('welcome-lang-en').classList.add('active');
  document.getElementById('welcome-lang-vi').classList.remove('active');
});

// Welcome gear button — opens global settings panel
const welcomeGearBtn = document.getElementById('welcome-gear-btn');
if (welcomeGearBtn) {
  welcomeGearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = DOM.settingsPanel.classList.toggle('hidden');
    if (isHidden) DOM.settingsOverlay.classList.add('hidden');
    else DOM.settingsOverlay.classList.remove('hidden');
  });
}

DOM.bgmSelector.addEventListener('change', (e) => setBGM(e.target.value));

DOM.bgmVolume.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  const volFrac = val / 100;
  APP_STATE.bgmVolume = volFrac;
  DOM.bgmVolValue.textContent = `${val}%`;
  bgmAudio.volume = volFrac;
  localStorage.setItem('focus_town_bgm_vol', volFrac);
});

/* ==========================================================================
   INTERACTIVE ISOMETRIC PREVIEW SWITCHER
   ========================================================================== */

const PREVIEW_MODELS = [
  { id: 'welcome', nameVi: 'Hòn đảo Focus Town', nameEn: 'Focus Town Island', render: getWelcomeHeroSVG },
  { id: 'tent', nameVi: 'Lều cắm trại (Hoàn thành)', nameEn: 'Campsite Tent (Completed)', render: () => getBuildingSVG('tent', 1.0, 'completed', false, 90) },
  { id: 'cafe', nameVi: 'Tiệm cà phê (Hoàn thành)', nameEn: 'Cozy Cafe (Completed)', render: () => getBuildingSVG('cafe', 1.0, 'completed', false, 90) },
  { id: 'observatory', nameVi: 'Đài thiên văn (Hoàn thành)', nameEn: 'Royal Observatory (Completed)', render: () => getBuildingSVG('observatory', 1.0, 'completed', false, 90) }
];
let currentPreviewIdx = 0;

export function updateWelcomePreview() {
  const model = PREVIEW_MODELS[currentPreviewIdx];
  if (DOM.welcomeHeroSvg) {
    DOM.welcomeHeroSvg.innerHTML = model.render();
  }
  if (DOM.previewModelName) {
    DOM.previewModelName.textContent = APP_STATE.lang === 'vi' ? model.nameVi : model.nameEn;
  }
}

// Bind interactive switcher buttons
if (DOM.btnPrevPreview) {
  DOM.btnPrevPreview.addEventListener('click', () => {
    currentPreviewIdx = (currentPreviewIdx - 1 + PREVIEW_MODELS.length) % PREVIEW_MODELS.length;
    updateWelcomePreview();
  });
}
if (DOM.btnNextPreview) {
  DOM.btnNextPreview.addEventListener('click', () => {
    currentPreviewIdx = (currentPreviewIdx + 1) % PREVIEW_MODELS.length;
    updateWelcomePreview();
  });
}

/* ==========================================================================
   APPLICATION BOOTSTRAP
   ========================================================================== */

async function bootstrap() {
  applyPreferencesToDOM();

  updateWelcomePreview();

  // Try to verify token on start
  const token = localStorage.getItem('focus_town_token');
  if (token) {
    const { verifyTokenOnServer } = await import('./js/auth.js');
    const result = await verifyTokenOnServer(token);
    if (result.ok && result.user) {
      enterApp(result.user, token);
      return;
    }
  }

  // Fallback to local session
  const sessionRaw = localStorage.getItem('focus_town_session');
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session && session.email) {
        const localRaw = localStorage.getItem(`focus_town_data_${session.email}`);
        let localData = { stats: { totalMinutes: 0, completedCount: 0, failedCount: 0 }, buildings: [], avatar: '' };
        if (localRaw) {
          try {
            localData = JSON.parse(localRaw);
          } catch (e) {
            console.error('Error parsing localData', e);
          }
        }
        const mockUser = { name: session.name || '', email: session.email, ...localData };
        enterApp(mockUser);
        return;
      }
    } catch (e) {
      console.error('Error parsing sessionRaw', e);
      localStorage.removeItem('focus_town_session');
    }
  }

  applyLanguage(APP_STATE.lang);
  switchView('welcome');

  if (APP_STATE.bgmActive !== 'off') setBGM(APP_STATE.bgmActive);
}

// --- Bind Avatar Upload Events ---
const avatarFileInput = document.getElementById('avatar-file-input');
const profileAvatarContainer = document.getElementById('profile-avatar-container');

if (profileAvatarContainer && avatarFileInput) {
  profileAvatarContainer.addEventListener('click', () => {
    if (APP_STATE.isGuest) {
      const isVi = APP_STATE.lang === 'vi';
      alert(isVi ? 'Vui lòng đăng ký hoặc đăng nhập tài khoản để tải ảnh đại diện!' : 'Please create an account or sign in to upload an avatar!');
      return;
    }
    avatarFileInput.click();
  });

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 2MB
    if (file.size > 2 * 1024 * 1024) {
      const isVi = APP_STATE.lang === 'vi';
      alert(isVi ? 'Kích thước ảnh đại diện phải nhỏ hơn 2MB!' : 'Avatar size must be less than 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (APP_STATE.currentUser) {
        APP_STATE.currentUser.avatar = reader.result;
        updateAvatarUI();
        saveData(); // Sync to MongoDB cloud automatically!
      }
    };
    reader.onerror = (err) => {
      console.error('Error reading avatar file:', err);
    };
    reader.readAsDataURL(file);
  });
}

window.DEBUG_DOM = DOM;

bootstrap();
