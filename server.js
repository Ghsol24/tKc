/* ==========================================================================
   Focus Town - Node.js/Express Backend Server
   MongoDB Atlas or Local MongoDB connection
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focustown';
const JWT_SECRET = process.env.JWT_SECRET || 'focustown-secret-key-12345';

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Increased limit slightly to accommodate base64 avatars
app.use(express.static(path.join(__dirname))); // Serve static files (HTML, CSS, JS)

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected:', MONGO_URI))
  .catch(err => console.warn('⚠️  MongoDB connection failed. Running in offline mode.\n', err.message));

// --- User Schema & Model ---
const buildingSchema = new mongoose.Schema({
  id: String,
  type: String,
  duration: Number,
  status: String,
  gridIndex: Number,
  date: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' }, // Holds base64 encoded image
  stats: {
    totalMinutes: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
  },
  buildings: { type: [buildingSchema], default: [] },
}, { timestamps: true });

// Pre-save hook to hash password automatically
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

// --- Helper: Check DB connection ---
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// --- Middleware: Authenticate JWT ---
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ ok: false, error: 'INVALID_TOKEN', message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
      }
      req.userEmail = decoded.email;
      next();
    });
  } else {
    next();
  }
}

// --- API: POST /api/auth/signup ---
// Body: { name, email, password, guestData?: { stats, buildings } }
app.post('/api/auth/signup', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ ok: false, error: 'DB_OFFLINE', message: 'Cơ sở dữ liệu đang ngoại tuyến' });
  }

  const { name, email, password, guestData } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS', message: 'Vui lòng điền đầy đủ Email và Mật khẩu' });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ ok: false, error: 'EMAIL_EXISTS', message: 'Email này đã được sử dụng' });
    }

    // Merge guest data if provided
    const stats = (guestData && guestData.stats) ? guestData.stats : { totalMinutes: 0, completedCount: 0, failedCount: 0 };
    const buildings = (guestData && guestData.buildings) ? guestData.buildings : [];

    // Save user. Pre-save hook bcyrpts the password automatically
    const newUser = await User.create({ name: name || '', email, password, stats, buildings, avatar: '' });

    // Generate JWT token
    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      ok: true,
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        stats: newUser.stats,
        buildings: newUser.buildings,
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: 'Lỗi máy chủ, thử lại sau' });
  }
});

// --- API: POST /api/auth/login ---
// Body: { email, password }
app.post('/api/auth/login', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ ok: false, error: 'DB_OFFLINE', message: 'Cơ sở dữ liệu đang ngoại tuyến' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS', message: 'Vui lòng điền Email và Mật khẩu' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' });
    }

    // Compare with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Fallback for legacy plain-text password from old DB entries
      if (user.password === password) {
        user.password = password; // Trigger save hook to hash it
        await user.save();
      } else {
        return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      ok: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        stats: user.stats,
        buildings: user.buildings,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: 'Lỗi máy chủ, thử lại sau' });
  }
});

// --- API: POST /api/auth/forgot-password ---
// Body: { email }
// Resets password to secure temp password and returns it
app.post('/api/auth/forgot-password', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ ok: false, error: 'DB_OFFLINE', message: 'Cơ sở dữ liệu đang ngoại tuyến' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ ok: false, error: 'MISSING_EMAIL', message: 'Vui lòng nhập Email' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'EMAIL_NOT_FOUND', message: 'Không tìm thấy tài khoản với email này' });
    }

    // Generate secure temp password
    const tempPassword = 'Focus' + Math.floor(100000 + Math.random() * 900000);
    user.password = tempPassword; // Will be hashed automatically by pre-save hook
    await user.save();

    return res.json({ ok: true, password: tempPassword, name: user.name });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: 'Lỗi máy chủ, thử lại sau' });
  }
});

// --- API: GET /api/auth/me ---
// Headers: Authorization: Bearer <token>
// Returns current authenticated user
app.get('/api/auth/me', authenticateJWT, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ ok: false, error: 'DB_OFFLINE', message: 'Cơ sở dữ liệu đang ngoại tuyến' });
  }

  if (!req.userEmail) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED', message: 'Chưa xác thực' });
  }

  try {
    const user = await User.findOne({ email: req.userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng' });
    }

    return res.json({
      ok: true,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        stats: user.stats,
        buildings: user.buildings,
      }
    });
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: 'Lỗi máy chủ, thử lại sau' });
  }
});

// --- API: POST /api/user/save ---
// Body: { email, stats, buildings, avatar }
app.post('/api/user/save', authenticateJWT, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ ok: false, error: 'DB_OFFLINE' });
  }

  // Use authenticated email if available, fallback to body
  const email = req.userEmail || req.body.email;
  const { stats, buildings, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ ok: false, error: 'MISSING_EMAIL' });
  }

  try {
    const updateData = {};
    if (stats) updateData.stats = stats;
    if (buildings) updateData.buildings = buildings;
    if (avatar !== undefined) updateData.avatar = avatar;

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateData },
      { new: true }
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
  }
});

// --- Catch-all: serve index.html for SPA ---
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🏡  Focus Town server running at http://localhost:${PORT}`);
  console.log(`    MongoDB URI: ${MONGO_URI}`);
});
