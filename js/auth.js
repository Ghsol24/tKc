/* ==========================================================================
   Focus Town - Authentication & Cloud Sync API Module
   ========================================================================== */

import { API_BASE } from './state.js';

export async function doSignUp(name, email, password) {
  // Get guest data to merge if present
  const guestRaw = localStorage.getItem('focus_town_data_guest');
  const guestData = guestRaw ? JSON.parse(guestRaw) : null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, guestData })
    });
    const json = await res.json();
    if (!json.ok) {
      if (json.error === 'DB_OFFLINE') {
        throw new Error('DB_OFFLINE');
      }
      return { ok: false, message: json.message || 'Đăng ký thất bại' };
    }

    // Clear guest data after successful merge
    localStorage.removeItem('focus_town_data_guest');
    
    // Save token to localStorage
    if (json.token) {
      localStorage.setItem('focus_town_token', json.token);
    }
    
    return { ok: true, user: json.user, token: json.token };
  } catch (e) {
    // Offline fallback: create account locally
    const users = getLocalUsers();
    if (users.find(u => u.email === email.toLowerCase())) {
      return { ok: false, message: 'Email này đã được sử dụng' };
    }
    const newUser = {
      name: name || '',
      email: email.toLowerCase(),
      password,
      avatar: '',
      stats: guestData?.stats || { totalMinutes: 0, completedCount: 0, failedCount: 0 },
      buildings: guestData?.buildings || []
    };
    users.push(newUser);
    saveLocalUsers(users);
    localStorage.removeItem('focus_town_data_guest');
    return { ok: true, user: newUser };
  }
}

export async function doSignIn(email, password) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!json.ok) {
      if (json.error === 'DB_OFFLINE') {
        throw new Error('DB_OFFLINE');
      }
      return { ok: false, message: json.message || 'Email hoặc mật khẩu không đúng' };
    }
    
    // Save token to localStorage
    if (json.token) {
      localStorage.setItem('focus_town_token', json.token);
    }
    
    return { ok: true, user: json.user, token: json.token };
  } catch (e) {
    // Offline fallback: check local users
    const users = getLocalUsers();
    const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: 'Email hoặc mật khẩu không đúng' };
    return { ok: true, user };
  }
}

export async function doForgotPassword(email) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!json.ok) {
      if (json.error === 'DB_OFFLINE') {
        throw new Error('DB_OFFLINE');
      }
      return { ok: false, message: json.message || 'Email không tồn tại' };
    }
    return { ok: true, password: json.password, name: json.name };
  } catch (e) {
    // Offline fallback
    const users = getLocalUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return { ok: false, message: 'Email không tồn tại' };
    return { ok: true, password: user.password, name: user.name };
  }
}

export async function verifyTokenOnServer(token) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const json = await res.json();
    if (!json.ok) return { ok: false };
    return { ok: true, user: json.user };
  } catch (e) {
    return { ok: false };
  }
}

// --- Local user DB helpers (offline fallback) ---
export function getLocalUsers() {
  const raw = localStorage.getItem('focus_town_users');
  return raw ? JSON.parse(raw) : [];
}

export function saveLocalUsers(users) {
  localStorage.setItem('focus_town_users', JSON.stringify(users));
}
