const db = require("../config/db");

const createActivitiesTable = async () => {
  try {
    console.log("🔍 Checking for activities table...");

    const [tables] = await db.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'activities'",
    );

    if (tables.length === 0) {
      console.log("📝 Creating activities table...");
      await db.query(`
        CREATE TABLE activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          sleep_hours DECIMAL(3, 1),
          exercise_minutes INT,
          mood INT,
          stress INT,
          discipline INT,
          empathy INT,
          physical_score INT,
          mental_score INT,
          character_score INT,
          summary LONGTEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      console.log("✅ Activities table created successfully");
    } else {
      console.log("ℹ️ Activities table already exists");
    }
  } catch (err) {
    console.error("❌ Migration error:", err.message);
  }
};

module.exports = { createActivitiesTable };
