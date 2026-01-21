const db = require("../config/db");

exports.addRoleAndMottoColumnsIfNotExist = async () => {
  try {
    console.log("🔍 Checking for role and motto columns...");

    // Check if role column exists
    const [roleResult] = await db.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
    );

    if (roleResult.length === 0) {
      console.log("➕ Adding role column...");
      await db.query(
        "ALTER TABLE users ADD COLUMN role VARCHAR(100) NULL AFTER email",
      );
      console.log("✅ role column added");
    } else {
      console.log("ℹ️ role column already exists");
    }

    // Check if motto column exists
    const [mottoResult] = await db.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'motto'",
    );

    if (mottoResult.length === 0) {
      console.log("➕ Adding motto column...");
      await db.query(
        "ALTER TABLE users ADD COLUMN motto LONGTEXT NULL AFTER role",
      );
      console.log("✅ motto column added");
    } else {
      console.log("ℹ️ motto column already exists");
    }

    console.log("✅ Migration completed successfully");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
  }
};
