const express = require("express");
const { createBlog, getBlogs, getBlogById, getAllBlogs, updateBlogAI } = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, createBlog);
router.get("/", getBlogs);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id/ai", updateBlogAI);

module.exports = router;
