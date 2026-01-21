const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, name, email, role, motto, photo FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Profile berhasil diambil",
      user: rows[0],
    });
  } catch (err) {
    console.error("❌ Get profile error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, motto, photo } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama tidak boleh kosong" });
    }

    console.log("📝 Updating profile for user:", userId);
    console.log("📸 Photo included:", !!photo);
    console.log("💭 Motto:", motto || "not provided");

    await db.query(
      "UPDATE users SET name = ?, motto = ?, photo = ? WHERE id = ?",
      [name.trim(), motto?.trim() || null, photo || null, userId],
    );

    const [rows] = await db.query(
      "SELECT id, name, email, role, motto, photo FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    console.log("✅ Profile updated successfully");
    res.json({
      message: "Profile berhasil diperbarui",
      user: rows[0],
    });
  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
