/* ==========================================================================
   Focus Town - Application State & LocalStorage Module
   ========================================================================== */

export const API_BASE = ''; // Same origin

export const PRESETS = [
  { minutes: 25, keyVi: "Tiêu chuẩn Pomodoro", keyEn: "Standard Pomodoro" },
  { minutes: 10, keyVi: "Khởi động nhanh", keyEn: "Quick Warmup" },
  { minutes: 50, keyVi: "Tập trung sâu", keyEn: "Deep Focus" },
  { minutes: 90, keyVi: "Siêu tập trung", keyEn: "Super Focus" }
];

export const BGM_STREAMS = {
  off: "",
  minecraft: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
  cozystudio: "https://assets.mixkit.co/music/preview/mixkit-cbpd-400.mp3"
};

export const bgmAudio = new Audio();
bgmAudio.loop = true;

export const TRANSLATIONS = {
  vi: {
    title: "Focus Town",
    subtitle: "Tập trung học tập, kiến tạo tương lai",
    featureTimer: "Pomodoro thông minh",
    featureBuilding: "Xây dựng thị trấn",
    featureStats: "Theo dõi thành tích",
    btnSignUp: "Tạo tài khoản",
    btnSignIn: "Đăng nhập",
    btnGuestMode: "Sử dụng không cần tài khoản →",
    btnBack: "Quay lại",
    btnLogout: "Đăng xuất",
    tabFocus: "Tập trung",
    tabTown: "Thị trấn",
    tabProfile: "Thành tích",
    signInTitle: "Chào mừng trở lại!",
    signInSubtitle: "Đăng nhập để tiếp tục xây dựng thị trấn của bạn",
    signUpTitle: "Xây dựng thị trấn của bạn",
    signUpSubtitle: "Tạo tài khoản để lưu thành tích học tập vĩnh viễn",
    forgotTitle: "Khôi phục mật khẩu",
    forgotSubtitle: "Nhập email đã đăng ký để xem lại mật khẩu của bạn",
    labelEmail: "Email",
    labelPassword: "Mật khẩu",
    labelName: "Tên của bạn",
    btnForgotPassword: "Quên mật khẩu?",
    btnNoAccount: "Chưa có tài khoản? Đăng ký",
    btnHaveAccount: "Đã có tài khoản? Đăng nhập",
    btnRecoverPassword: "Khôi phục mật khẩu",
    btnBackToSignIn: "← Quay lại đăng nhập",
    guestSyncNotice: "Tiến trình thị trấn của bạn sẽ được lưu vào tài khoản mới!",
    readyBadge: "Sẵn sàng khởi công",
    buildingBadge: "Đang thi công...",
    emptyLand: "Đất trống hoang sơ",
    settingsTitle: "Cài đặt giao diện",
    settingsDesc: "Tùy biến không gian học tập giúp nâng cao hiệu quả tập trung",
    themeLabel: "Chủ đề màu sắc",
    themeCream: "🏡 Kem ấm áp (Mặc định)",
    themeMatcha: "🍵 Matcha Tea (Màn dịu)",
    themeIndigo: "🌲 Rừng đêm tối (Bảo vệ mắt)",
    dimmerLabel: "Bộ giảm độ sáng màn hình",
    dimmerBrightest: "Sáng nhất",
    dimmerDim1: "Sáng nhẹ",
    dimmerDim2: "Dịu mắt",
    dimmerDarkest: "Tối (Dịu nhất)",
    langLabel: "Ngôn ngữ",
    bgmLabel: "Nhạc nền tập trung",
    bgmOff: "Tắt nhạc",
    bgmVolLabel: "Âm lượng nhạc",
    controlTitle: "Bảng điều khiển",
    selectTimeLabel: "Chọn thời gian học",
    customTimeLabel: "Tùy chỉnh thời gian",
    timePresetTab: "⚡ Mốc Nhanh",
    timeCustomTab: "⏱️ Tự Chọn",
    pickerHoursLabel: "Chọn giờ:",
    pickerMinutesLabel: "Chọn phút:",
    durationSuffixHour: "giờ",
    durationSuffixMinute: "phút",
    selectBuildingLabel: "Chọn công trình xây dựng",
    themeTent: "Lều dã ngoại",
    themeDescTent: "Đơn sơ • Dành cho mốc dưới 25 phút tập trung",
    themeCafe: "Tiệm cà phê",
    themeDescCafe: "Ấm cúng • Dành cho mốc 25 đến 45 phút tập trung",
    themeStadium: "Sân vận động",
    themeDescStadium: "Sôi động • Dành cho mốc từ 45 phút tập trung",
    themeLibrary: "Thư viện sách",
    themeDescLibrary: "Học thuật • Dành cho mốc từ 50 phút tập trung",
    themeCampus: "Khuôn viên trường",
    themeDescCampus: "Tri thức • Dành cho mốc từ 60 phút tập trung",
    themeObservatory: "Đài thiên văn",
    themeDescObservatory: "Huyền bí • Dành cho mốc từ 75 phút tập trung",
    themeLighthouse: "Ngọn hải đăng",
    themeDescLighthouse: "Dẫn đường • Dành cho mốc từ 90 phút tập trung",
    themeBerlin: "Thành phố Berlin",
    themeDescBerlin: "Kỳ quan • Dành cho mốc từ 120 phút tập trung",
    buildingLockedDesc: "🔒 Hoàn thành {count} công trình để mở",
    ambientLabel: "Âm thanh nền tập trung",
    soundOff: "Tắt âm",
    soundRain: "Tiếng mưa",
    soundWind: "Tiếng gió",
    btnStart: "Bắt đầu tập trung",
    btnGiveUp: "Dừng lại (Bỏ cuộc)",
    statsTitle: "Thành tích của bạn",
    statFocusTime: "Phút tập trung",
    statCompleted: "Công trình hoàn thành",
    statFailed: "Phiên bị bỏ dở",
    statBuildings: "Công trình trong thị trấn",
    townTitle: "🏡 Thị trấn của bạn",
    townSubtitle: "Nơi lưu giữ những nỗ lực học tập dưới dạng các công trình kiến trúc",
    btnResetTown: "Khởi động lại thị trấn",
    confirmReset: "Bạn có chắc muốn giải phóng thị trấn này không? Tất cả các tòa nhà và chỉ số tập trung sẽ bị xóa vĩnh viễn!",
    confirmGiveUp: "Công trường thi công của bạn sẽ bị đóng cửa bỏ hoang đấy!",
    confirmModalTitle: "Xác nhận dừng phiên",
    confirmCancel: "Tiếp tục học",
    confirmOk: "Bỏ cuộc",
    phaseFocus: "Tập trung cao độ",
    phaseReady: "Thời gian tập trung",
    phaseComplete: "Hoàn thành tốt!",
    focusSubtext: "Hoàn thành để xây dựng công trình vào thị trấn",
    btnFocusPause: "Tạm dừng",
    btnFocusResume: "Tiếp tục",
    modalTitle: "Chúc mừng bạn đã hoàn thành!",
    modalMessage: "Bạn đã tập trung thành công trong <strong>{min} phút</strong> và xây dựng thành công <strong>{building}</strong> vào thị trấn!",
    modalClose: "Quay lại thị trấn",
    cabin: "Lều dã ngoại",
    tent: "Lều dã ngoại",
    cafe: "Tiệm cà phê ấm cúng",
    stadium: "Sân vận động lớn",
    library: "Thư viện sách cổ điển",
    campus: "Khuôn viên trường học rộng lớn",
    observatory: "Đài thiên văn hoàng gia",
    lighthouse: "Ngọn hải đăng kỳ vĩ",
    berlin: "Thành phố Berlin đồ sộ",
    ruin: "Công trường bỏ hoang",
    plotTooltipEmpty: "Đất trống (Nhấp chuột để xây dựng ở đây)",
    plotTooltipBuilding: "{name} ({min} phút) - {date}",
    profileModeGuest: "Chế độ khách",
    profileModeAccount: "Tài khoản đã xác nhận",
    upgradeTitle: "Lưu thành tích vĩnh viễn?",
    upgradeDesc: "Tạo tài khoản để đồng bộ thị trấn của bạn lên đám mây — không bao giờ mất tiến trình nữa!",
    profileActionsTitle: "Quản lý tài khoản",
    syncSuccess: "✅ Đã đồng bộ lên đám mây!",
    syncFail: "⚠️ Không thể đồng bộ — đang lưu cục bộ"
  },
  en: {
    title: "Focus Town",
    subtitle: "Focus on studying, build your future",
    featureTimer: "Smart Pomodoro",
    featureBuilding: "Build your town",
    featureStats: "Track achievements",
    btnSignUp: "Create account",
    btnSignIn: "Sign in",
    btnGuestMode: "Use without an account →",
    btnBack: "Back",
    btnLogout: "Log out",
    tabFocus: "Focus",
    tabTown: "My Town",
    tabProfile: "Profile",
    signInTitle: "Welcome back!",
    signInSubtitle: "Sign in to continue building your town",
    signUpTitle: "Build your town",
    signUpSubtitle: "Create an account to save your progress forever",
    forgotTitle: "Recover password",
    forgotSubtitle: "Enter your registered email to retrieve your password",
    labelEmail: "Email",
    labelPassword: "Password",
    labelName: "Your name",
    btnForgotPassword: "Forgot password?",
    btnNoAccount: "No account? Sign up",
    btnHaveAccount: "Have an account? Sign in",
    btnRecoverPassword: "Recover password",
    btnBackToSignIn: "← Back to sign in",
    guestSyncNotice: "Your town progress will be saved into your new account!",
    readyBadge: "Ready to Build",
    buildingBadge: "Under Construction...",
    emptyLand: "Wild Empty Plot",
    settingsTitle: "Interface Settings",
    settingsDesc: "Customize your study environment to enhance productivity",
    themeLabel: "Color Theme",
    themeCream: "🏡 Cozy Cream (Default)",
    themeMatcha: "🍵 Matcha Tea (Dim Theme)",
    themeIndigo: "🌲 Forest Night (Eye Care)",
    dimmerLabel: "Screen Dimmer",
    dimmerBrightest: "Brightest",
    dimmerDim1: "Soft Bright",
    dimmerDim2: "Eye Soothing",
    dimmerDarkest: "Darkest (Soothing)",
    langLabel: "Language",
    bgmLabel: "Background Music",
    bgmOff: "Mute",
    bgmVolLabel: "Music Volume",
    controlTitle: "Control Center",
    selectTimeLabel: "Select Duration",
    customTimeLabel: "Custom Duration",
    timePresetTab: "⚡ Presets",
    timeCustomTab: "⏱️ Custom",
    pickerHoursLabel: "Hours:",
    pickerMinutesLabel: "Minutes:",
    durationSuffixHour: "hour",
    durationSuffixHours: "hours",
    durationSuffixMinute: "min",
    durationSuffixMinutes: "mins",
    selectBuildingLabel: "Select Building Style",
    themeTent: "Campsite Tent",
    themeDescTent: "Simple • For under 25-minute focus sessions",
    themeCafe: "Cozy Cafe",
    themeDescCafe: "Cozy • For 25 to 45-minute focus sessions",
    themeStadium: "Grand Stadium",
    themeDescStadium: "Energetic • For 45+ minute focus sessions",
    themeLibrary: "Royal Library",
    themeDescLibrary: "Academic • For 50+ minute focus sessions",
    themeCampus: "College Campus",
    themeDescCampus: "Intellectual • For 60+ minute focus sessions",
    themeObservatory: "Royal Observatory",
    themeDescObservatory: "Mystic • For 75+ minute focus sessions",
    themeLighthouse: "Coastal Lighthouse",
    themeDescLighthouse: "Guiding • For 90+ minute focus sessions",
    themeBerlin: "Berlin Brandenburg",
    themeDescBerlin: "Wondrous • For 120+ minute focus sessions",
    buildingLockedDesc: "🔒 Complete {count} sessions to unlock",
    ambientLabel: "Ambient Focus Sound",
    soundOff: "Mute",
    soundRain: "Rain Noise",
    soundWind: "Forest Wind",
    btnStart: "Start Focusing",
    btnGiveUp: "Stop (Give Up)",
    statsTitle: "Your Achievements",
    statFocusTime: "Focus Minutes",
    statCompleted: "Completed Buildings",
    statFailed: "Abandoned Sessions",
    statBuildings: "Buildings in Town",
    townTitle: "🏡 Your Town",
    townSubtitle: "Visualizing your dedicated study sessions as architecture",
    btnResetTown: "Reset Entire Town",
    confirmReset: "Are you sure you want to reset this town? All buildings and statistics will be permanently deleted!",
    confirmGiveUp: "Your active construction site will be closed and left abandoned!",
    confirmModalTitle: "Stop Session",
    confirmCancel: "Keep Studying",
    confirmOk: "Give Up",
    phaseFocus: "Deep Focus Session",
    phaseReady: "Ready to Focus",
    phaseComplete: "Well Done!",
    focusSubtext: "Complete to add this building to your town",
    btnFocusPause: "Pause",
    btnFocusResume: "Resume",
    modalTitle: "Congratulations!",
    modalMessage: "You have focused for <strong>{min} minutes</strong> and successfully added a <strong>{building}</strong> to your town!",
    modalClose: "Return to Town",
    cabin: "Campsite Tent",
    tent: "Campsite Tent",
    cafe: "Cozy Cafe",
    stadium: "Grand Stadium",
    library: "Royal Library",
    campus: "College Campus",
    observatory: "Royal Observatory",
    lighthouse: "Coastal Lighthouse",
    berlin: "Berlin Brandenburg",
    ruin: "Abandoned Scaffold",
    plotTooltipEmpty: "Empty land (Click to build here)",
    plotTooltipBuilding: "{name} ({min} mins) - {date}",
    profileModeGuest: "Guest Mode",
    profileModeAccount: "Verified Account",
    upgradeTitle: "Save your progress forever?",
    upgradeDesc: "Create an account to sync your town to the cloud — never lose progress again!",
    profileActionsTitle: "Account management",
    syncSuccess: "✅ Synced to cloud!",
    syncFail: "⚠️ Could not sync — saved locally"
  }
};

export const APP_STATE = {
  // View & Tab routing
  currentView: 'welcome',  // 'welcome' | 'auth' | 'app'
  activeTab: 'focus',      // 'focus' | 'town' | 'profile'

  // Auth
  currentUser: null,  // null = guest, { name, email, ... } = logged in
  isGuest: true,
  token: null,        // JWT token

  // Timer
  durationSeconds: 25 * 60,
  timeLeft: 25 * 60,
  isRunning: false,
  isPaused: false,
  timerInterval: null,
  activePreset: 25,
  lang: 'vi',
  timeSelectionMode: 'preset',
  customHours: 0,
  customMinutes: 25,
  lastRenderedKey: null,
  selectedBuilding: 'tent',

  // BGM
  bgmActive: 'off',
  bgmVolume: 0.5,

  // Data
  stats: { totalMinutes: 0, completedCount: 0, failedCount: 0 },
  buildings: []
};

export function getDataKey() {
  if (APP_STATE.isGuest) return 'focus_town_data_guest';
  return `focus_town_data_${APP_STATE.currentUser.email}`;
}

export function saveData() {
  const data = {
    stats: APP_STATE.stats,
    buildings: APP_STATE.buildings,
  };
  if (!APP_STATE.isGuest && APP_STATE.currentUser) {
    data.avatar = APP_STATE.currentUser.avatar || '';
  }
  localStorage.setItem(getDataKey(), JSON.stringify(data));

  if (!APP_STATE.isGuest && APP_STATE.currentUser) {
    syncToCloud().catch(() => { });
  }
}

export async function syncToCloud() {
  if (!APP_STATE.currentUser) return;
  const token = localStorage.getItem('focus_town_token');
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api/user/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: APP_STATE.currentUser.email,
        stats: APP_STATE.stats,
        buildings: APP_STATE.buildings,
        avatar: APP_STATE.currentUser.avatar || ''
      })
    });
    const json = await res.json();
    if (!json.ok) console.warn('Cloud sync failed:', json);
  } catch (e) {
    console.warn('Cloud sync unavailable, using localStorage.');
  }
}

export function loadLocalData() {
  const raw = localStorage.getItem(getDataKey());
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data) {
        if (data.stats) APP_STATE.stats = data.stats;
        if (data.buildings) APP_STATE.buildings = data.buildings;
        if (!APP_STATE.isGuest && APP_STATE.currentUser && data.avatar) {
          APP_STATE.currentUser.avatar = data.avatar;
        }
      }
    } catch (e) {
      console.error('Error parsing local data from localStorage', e);
      // Fallback: clear corrupt local data
      localStorage.removeItem(getDataKey());
    }
  }
}

export function loadPreferencesFromStorage() {
  const themeSaved = localStorage.getItem('focus_town_theme');
  const brightnessSaved = localStorage.getItem('focus_town_brightness');
  const langSaved = localStorage.getItem('focus_town_lang');
  const bgmSaved = localStorage.getItem('focus_town_bgm');
  const bgmVolSaved = localStorage.getItem('focus_town_bgm_vol');

  if (langSaved) APP_STATE.lang = langSaved;
  if (bgmSaved) APP_STATE.bgmActive = bgmSaved;
  if (bgmVolSaved !== null) APP_STATE.bgmVolume = parseFloat(bgmVolSaved);

  return { themeSaved, brightnessSaved, langSaved, bgmSaved, bgmVolSaved };
}
