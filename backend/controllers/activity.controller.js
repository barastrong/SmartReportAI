const { spawn } = require("child_process");
const path = require("path");
const db = require("../config/db");

exports.predictActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sleepHours, exerciseMinutes, mood, stress, discipline, empathy } =
      req.body;

    // Validasi input
    if (
      sleepHours === undefined ||
      exerciseMinutes === undefined ||
      mood === undefined ||
      stress === undefined ||
      discipline === undefined ||
      empathy === undefined
    ) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    console.log("🤖 Processing AI prediction for user:", userId);
    console.log("📊 Activity data:", {
      sleepHours,
      exerciseMinutes,
      mood,
      stress,
      discipline,
      empathy,
    });

    // Call Python predict.py
    const pythonScriptPath = path.join(__dirname, "../../ai/predict.py");
    const inputData = JSON.stringify({
      sleepHours: Number(sleepHours),
      exerciseMinutes: Number(exerciseMinutes),
      mood: Number(mood),
      stress: Number(stress),
      discipline: Number(discipline),
      empathy: Number(empathy),
    });

    const pythonProcess = spawn("python", [pythonScriptPath], {
      cwd: path.join(__dirname, "../../ai"),
    });

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("❌ Python script error:", pythonError);
        return res.status(500).json({
          message: "Gagal memproses prediksi AI",
          error: pythonError,
        });
      }

      try {
        const prediction = JSON.parse(pythonOutput);

        // Save to database
        await db.query(
          `INSERT INTO activities (user_id, sleep_hours, exercise_minutes, mood, stress, discipline, empathy, physical_score, mental_score, character_score, summary, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            sleepHours,
            exerciseMinutes,
            mood,
            stress,
            discipline,
            empathy,
            prediction.Physical?.score || 0,
            prediction.Mental?.score || 0,
            prediction.Character?.score || 0,
            prediction.Summary || "",
          ],
        );

        console.log("✅ Activity saved to database");

        res.json({
          message: "Prediksi berhasil dibuat",
          prediction: prediction,
        });
      } catch (parseError) {
        console.error("❌ Parse error:", parseError.message);
        res.status(500).json({
          message: "Error parsing AI response",
          error: parseError.message,
        });
      }
    });
  } catch (err) {
    console.error("❌ Predict activity error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT id, sleep_hours, exercise_minutes, mood, stress, discipline, empathy,
              physical_score, mental_score, character_score, summary, created_at
       FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [userId],
    );

    res.json({
      message: "Activities fetched successfully",
      activities: rows,
    });
  } catch (err) {
    console.error("❌ Get activities error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getLatestActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT id, sleep_hours, exercise_minutes, mood, stress, discipline, empathy,
              physical_score, mental_score, character_score, summary, created_at
       FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tidak ada aktivitas" });
    }

    res.json({
      message: "Latest activity fetched",
      activity: rows[0],
    });
  } catch (err) {
    console.error("❌ Get latest activity error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
