/* ==========================================================================
   Focus Town - Pomodoro Timer Logic & Audio Synthesizer Module
   ========================================================================== */

import { APP_STATE, BGM_STREAMS, bgmAudio, TRANSLATIONS, saveData } from './state.js';
import { getBuildingName } from './building.js';

// We will import DOM elements and UI update functions dynamically from app.js to prevent circular binding issues
let DOM = null;
let UI = null;

export function registerUI(domInstance, uiMethods) {
  DOM = domInstance;
  UI = uiMethods;
}

/* ==========================================================================
   WEB AUDIO SYNTHESIZER
   ========================================================================== */

export class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.rainNode = null;
    this.windNode = null;
    this.isPlaying = false;
    this.currentType = 'off';
  }
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  createNoiseBuffer(type) {
    const buf = this.ctx.createBuffer(1, 2 * this.ctx.sampleRate, this.ctx.sampleRate);
    const out = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < out.length; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'brown') {
        out[i] = (lastOut + 0.025 * w) / 1.025;
        lastOut = out[i];
        out[i] *= 3.8;
      } else {
        out[i] = w;
      }
    }
    return buf;
  }
  playRain() {
    this.stop();
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('brown');
    src.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 800;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.22;
    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(0);
    this.rainNode = { source: src, gain, filter: filt };
    this.isPlaying = true;
  }
  playWind() {
    this.stop();
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const src = this.ctx.createBufferSource();
    src.buffer = this.createNoiseBuffer('brown');
    src.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.Q.value = 2;
    filt.frequency.value = 350;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoG = this.ctx.createGain();
    lfoG.gain.value = 180;
    lfo.connect(lfoG);
    lfoG.connect(filt.frequency);
    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(0);
    lfo.start(0);
    this.windNode = { source: src, lfo, gain, filter: filt };
    this.isPlaying = true;
  }
  stop() {
    if (this.rainNode) {
      try { this.rainNode.source.stop(); } catch(e){}
      this.rainNode.source.disconnect();
      this.rainNode = null;
    }
    if (this.windNode) {
      try { this.windNode.source.stop(); this.windNode.lfo.stop(); } catch(e){}
      this.windNode.source.disconnect();
      this.windNode.lfo.disconnect();
      this.windNode = null;
    }
    this.isPlaying = false;
  }
  setSound(type) {
    this.currentType = type;
    if (type === 'rain') this.playRain();
    else if (type === 'wind') this.playWind();
    else this.stop();
  }
}

export const synth = new SoundSynthesizer();

/* ==========================================================================
   BGM PLAYBACK HELPERS
   ========================================================================== */

export function playBGM() {
  const type = APP_STATE.bgmActive;
  if (type === 'off' || !BGM_STREAMS[type]) {
    bgmAudio.pause();
    bgmAudio.src = "";
    return;
  }
  const url = BGM_STREAMS[type];
  if (bgmAudio.src !== url) bgmAudio.src = url;
  bgmAudio.volume = APP_STATE.bgmVolume;
  bgmAudio.play().catch(() => {});
}

export function setBGM(type) {
  APP_STATE.bgmActive = type;
  localStorage.setItem('focus_town_bgm', type);
  if (type === 'off' || !BGM_STREAMS[type]) {
    bgmAudio.pause();
    bgmAudio.src = "";
  } else {
    if (bgmAudio.src !== BGM_STREAMS[type]) bgmAudio.src = BGM_STREAMS[type];
    bgmAudio.volume = APP_STATE.bgmVolume;
    bgmAudio.play().catch(() => {});
  }
}

/* ==========================================================================
   POMODORO COUNTDOWN LOGIC
   ========================================================================== */

export function startTimer() {
  if (APP_STATE.isRunning) return;
  synth.setSound(synth.currentType);
  playBGM();
  APP_STATE.isRunning = true;
  APP_STATE.isPaused = false;

  DOM.btnStart.classList.add('hidden');
  DOM.btnGiveUp.classList.remove('hidden');
  document.querySelectorAll('.btn-preset').forEach(btn => btn.disabled = true);
  DOM.customSlider.disabled = true;
  document.querySelectorAll('.btn-theme-select').forEach(btn => btn.disabled = true);
  DOM.timerPhase.textContent = TRANSLATIONS[APP_STATE.lang].phaseFocus;
  document.body.classList.add('focus-active');

  // Close building flyout and disable its trigger while session is running
  const flyoutCard = document.getElementById('building-flyout-card');
  const flyoutMainLayout = document.getElementById('main-layout');
  const flyoutAppContainer = document.querySelector('#view-app .app-container');
  const buildingTrigger = document.getElementById('btn-selected-building-trigger');
  if (flyoutCard) flyoutCard.classList.add('hidden');
  if (flyoutMainLayout) flyoutMainLayout.classList.remove('flyout-open');
  if (flyoutAppContainer) flyoutAppContainer.classList.remove('flyout-open');
  if (buildingTrigger) {
    buildingTrigger.classList.remove('flyout-active');
    buildingTrigger.setAttribute('aria-expanded', 'false');
    buildingTrigger.disabled = true;
  }

  if (DOM.focusCardContainer) DOM.focusCardContainer.classList.remove('hidden');
  if (DOM.focusStagePlaceholder && DOM.constructionStage) DOM.focusStagePlaceholder.appendChild(DOM.constructionStage);

  const pauseTextEl = document.getElementById('text-focus-pause');
  const pauseIconEl = document.getElementById('icon-focus-pause');
  if (pauseTextEl) pauseTextEl.textContent = TRANSLATIONS[APP_STATE.lang].btnFocusPause;
  if (pauseIconEl) pauseIconEl.textContent = '⏸️';

  APP_STATE.lastRenderedKey = null;
  UI.updateTimerDisplay();

  APP_STATE.timerInterval = setInterval(() => {
    if (!APP_STATE.isPaused) {
      APP_STATE.timeLeft--;
      UI.updateTimerDisplay();
      if (APP_STATE.timeLeft <= 0) {
        clearInterval(APP_STATE.timerInterval);
        completeSession();
      }
    }
  }, 1000);
}

export function completeSession() {
  APP_STATE.isRunning = false;
  APP_STATE.isPaused = false;
  clearInterval(APP_STATE.timerInterval);
  document.body.classList.remove('focus-active');

  if (DOM.focusCardContainer) DOM.focusCardContainer.classList.add('hidden');
  if (DOM.normalStagePlaceholder && DOM.constructionStage) DOM.normalStagePlaceholder.appendChild(DOM.constructionStage);

  DOM.btnStart.classList.remove('hidden');
  DOM.btnGiveUp.classList.add('hidden');
  document.querySelectorAll('.btn-preset').forEach(btn => btn.disabled = false);
  DOM.customSlider.disabled = false;
  document.querySelectorAll('.btn-theme-select').forEach(btn => btn.disabled = false);
  DOM.timerPhase.textContent = TRANSLATIONS[APP_STATE.lang].phaseComplete;

  // Re-enable building trigger after session completes
  const buildingTriggerComplete = document.getElementById('btn-selected-building-trigger');
  if (buildingTriggerComplete) buildingTriggerComplete.disabled = false;

  const durationMins = Math.round(APP_STATE.durationSeconds / 60);
  const type = APP_STATE.selectedBuilding;
  playChime();

  APP_STATE.stats.totalMinutes += durationMins;
  APP_STATE.stats.completedCount++;

  const occupied = APP_STATE.buildings.map(b => b.gridIndex);
  let nextIdx = 0;
  while (nextIdx < 32 && occupied.includes(nextIdx)) nextIdx++;
  if (nextIdx >= 32) {
    nextIdx = 0;
    APP_STATE.buildings.shift();
  }

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
  APP_STATE.buildings.push({
    id: Date.now().toString(),
    type,
    duration: durationMins,
    status: 'completed',
    gridIndex: nextIdx,
    date: dateStr
  });

  saveData();
  UI.updateStatsUI();
  UI.renderTownGrid();

  const msgTemplate = TRANSLATIONS[APP_STATE.lang].modalMessage;
  DOM.modalMessage.innerHTML = msgTemplate.replace('{min}', durationMins).replace('{building}', getBuildingName(type));
  DOM.modalCompletion.classList.remove('hidden');
  APP_STATE.timeLeft = APP_STATE.durationSeconds;
  UI.updateTimerDisplay();
}

export function giveUpSession() {
  if (!APP_STATE.isRunning) return;
  DOM.modalConfirmGiveUp.classList.remove('hidden');
}

export function executeGiveUp() {
  APP_STATE.isRunning = false;
  APP_STATE.isPaused = false;
  clearInterval(APP_STATE.timerInterval);
  document.body.classList.remove('focus-active');

  if (DOM.focusCardContainer) DOM.focusCardContainer.classList.add('hidden');
  if (DOM.normalStagePlaceholder && DOM.constructionStage) DOM.normalStagePlaceholder.appendChild(DOM.constructionStage);

  DOM.btnStart.classList.remove('hidden');
  DOM.btnGiveUp.classList.add('hidden');
  document.querySelectorAll('.btn-preset').forEach(btn => btn.disabled = false);
  DOM.customSlider.disabled = false;
  document.querySelectorAll('.btn-theme-select').forEach(btn => btn.disabled = false);
  DOM.timerPhase.textContent = TRANSLATIONS[APP_STATE.lang].phaseReady;

  // Re-enable building trigger after session is given up
  const buildingTriggerGiveup = document.getElementById('btn-selected-building-trigger');
  if (buildingTriggerGiveup) buildingTriggerGiveup.disabled = false;

  const durationMins = Math.round(APP_STATE.durationSeconds / 60);
  const type = APP_STATE.selectedBuilding;
  APP_STATE.stats.failedCount++;

  const occupied = APP_STATE.buildings.map(b => b.gridIndex);
  let nextIdx = 0;
  while (nextIdx < 32 && occupied.includes(nextIdx)) nextIdx++;
  if (nextIdx < 32) {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    APP_STATE.buildings.push({
      id: Date.now().toString(),
      type,
      duration: Math.round((APP_STATE.durationSeconds - APP_STATE.timeLeft) / 60),
      status: 'abandoned',
      gridIndex: nextIdx,
      date: dateStr
    });
  }

  saveData();
  UI.updateStatsUI();
  UI.renderTownGrid();
  APP_STATE.timeLeft = APP_STATE.durationSeconds;
  UI.updateTimerDisplay();
}

export function playChime() {
  synth.init();
  const ctx = synth.ctx;
  if (ctx.state === 'suspended') ctx.resume();
  const osc1 = ctx.createOscillator(), osc2 = ctx.createOscillator(), gain = ctx.createGain();
  osc1.type = 'sine'; osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(440, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.2);
  osc2.frequency.setValueAtTime(554.37, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 1.2);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
  osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination);
  osc1.start(); osc2.start();
  osc1.stop(ctx.currentTime + 1.6); osc2.stop(ctx.currentTime + 1.6);
}
