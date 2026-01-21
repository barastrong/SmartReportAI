const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    email = email.trim().toLowerCase();
    name = name.trim();
    const defaultRole = "User"; // Auto-assign role

    if (password.length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter" });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    console.log("🔐 Hashing password untuk:", email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(
      "✅ Password di-hash:",
      hashedPassword.substring(0, 20) + "...",
    );

    await db.query(
      "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
      [name, email, defaultRole, hashedPassword],
    );

    console.log("✅ Register berhasil untuk:", email);
    console.log("👤 Role assigned:", defaultRole);
    res.status(201).json({ message: "Register berhasil" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    email = email.trim().toLowerCase();

    const [rows] = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (rows.length === 0) {
      await bcrypt.compare(password, "$2a$12$invalidhashinvalidhash");
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const userData = rows[0];
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE },
    );

    console.log("✅ Login berhasil untuk:", email);
    console.log("🔑 Token generated");

    res.json({
      message: "Login berhasil",
      token: token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
