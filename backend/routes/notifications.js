const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// ✅ Save notification
router.post("/", async (req, res) => {
  try {
    const { appName, title, message } = req.body;

    if (!appName || !message) {
      return res.status(400).json({ error: "appName & message required" });
    }

    const result = await pool.query(
      `INSERT INTO notifications (app_name, title, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [appName, title || "", message]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error("Notification Error:", err);
    res.status(500).json({ error: "Failed to save notification" });
  }
});

// ✅ Get all notifications
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ Delete a specific notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notifications WHERE id = $1", [id]);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// ✅ Clear all notifications
router.delete("/", async (req, res) => {
  try {
    await pool.query("DELETE FROM notifications");
    res.json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    console.error("Clear Error:", err);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

module.exports = router;