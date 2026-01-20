const db = require('../config/db');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // cek email
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.json({ message: 'Register berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT id, name, email FROM users WHERE email=? AND password=?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({
      message: 'Login berhasil',
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
