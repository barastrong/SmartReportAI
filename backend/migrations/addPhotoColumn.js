const db = require("../config/db");

const addPhotoColumnIfNotExists = async () => {
  try {
    const [rows] = await db.query(
      "SHOW COLUMNS FROM users WHERE Field = 'photo'",
    );

    if (rows.length === 0) {
      console.log("📝 Adding photo column to users table...");
      await db.query(
        "ALTER TABLE users ADD COLUMN photo LONGTEXT NULL AFTER email",
      );
      console.log("✅ Photo column added successfully!");
    } else {
      console.log("✅ Photo column already exists");
    }
  } catch (error) {
    console.error("❌ Migration error:", error.message);
  }
};

module.exports = { addPhotoColumnIfNotExists };
