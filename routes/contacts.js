const express = require("express");
const router = express.Router();
const pool = require("../db/pool"); // you are using PostgreSQL

// Save contacts
router.post("/", async (req, res) => {
  try {
    const contacts = req.body;

    for (let c of contacts) {
      await pool.query(
        "INSERT INTO contacts (name, phone) VALUES ($1, $2)",
        [c.name, c.phone]
      );
    }

    res.json({ message: "Contacts saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;