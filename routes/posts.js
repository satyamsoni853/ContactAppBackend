const express = require("express");
const pool = require("../db/pool");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/posts - Get all posts
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ posts: result.rows });
  } catch (err) {
    console.error("Get posts error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as author_name 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post: result.rows[0] });
  } catch (err) {
    console.error("Get post error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/posts - Create post (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, content]
    );

    res.status(201).json({ post: result.rows[0] });
  } catch (err) {
    console.error("Create post error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/posts/:id - Update post (protected)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check ownership
    const check = await pool.query("SELECT user_id FROM posts WHERE id = $1", [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (check.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const result = await pool.query(
      "UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = NOW() WHERE id = $3 RETURNING *",
      [title, content, req.params.id]
    );

    res.json({ post: result.rows[0] });
  } catch (err) {
    console.error("Update post error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/posts/:id - Delete post (protected)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const check = await pool.query("SELECT user_id FROM posts WHERE id = $1", [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (check.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
