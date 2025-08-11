const mongoose=require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    }, 
    tags: [{
        type: String,
    }],
    summary: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ai_status: {
        type: String,
        enum: ['pending', 'processing', 'done', 'error'],
        default: 'pending',
    },
    ai_tags: [{
        tag: { type: String },
        confidence: { type: Number },
        source: { type: String, enum: ['extractive', 'generated'] }
    }],
    ai_categories: [{
        name: { type: String },
        score: { type: Number }
    }],
    ai_model_version: {
        type: String,
    },
    embedding_id:{
        type: String, 
    },  
    processed_at: {
        type: Date,
    },
    impact_score: { type: Number }
});

module.exports = mongoose.model('Blog', BlogSchema);
