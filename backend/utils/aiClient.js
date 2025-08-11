const axios = require('axios');

const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8001';

/**
 * Send blog ID to AI processing worker
 * @param {string} blogId - The ID of the blog to process
 * @returns {Promise} - Response from AI worker
 */
const sendToAIWorker = async (blogId) => {
    try {
        console.log(`Sending blog ${blogId} to AI worker for processing...`);
        
        const response = await axios.post(`${WORKER_URL}/process-blog`, {
            blog_id: blogId
        }, {
            timeout: 60000, // 60 second timeout for LLM processing
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('AI worker response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error sending to AI worker:', error.message);
        
        // Don't throw error - AI processing failure shouldn't break blog creation
        return {
            blog_id: blogId,
            status: 'failed',
            error: error.message,
            message: 'AI processing failed but blog was created successfully'
        };
    }
};

module.exports = { sendToAIWorker };
