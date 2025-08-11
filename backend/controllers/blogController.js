const Blog = require("../models/blog");
const { sendToAIWorker } = require("../utils/aiClient");

exports.createBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        // Get user ID from JWT token (set by auth middleware)
        const author = req.user.id;
        const newBlog = await Blog.create({
            title,
            content,
            tags,
            author,
            ai_status: 'pending', // Default AI status
        });
        
        // Send blog ID to AI worker for processing
        sendToAIWorker(newBlog._id.toString());
        
        res.status(201).json(newBlog);
    } catch (err) {
        console.error('Blog creation error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name email");
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single blog by ID for AI processing (no populate needed)
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all blogs (empty function)
exports.getAllBlogs = async (req, res) => {
    try {
        // TODO: Implement get all blogs logic
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update blog with AI processed data
exports.updateBlogAI = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
