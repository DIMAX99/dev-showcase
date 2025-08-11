from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import httpx
from models.llama_model import LlamaModel

app = FastAPI(title="AI Blog Processing Worker", version="1.0.0")

# Initialize Llama model
llama_model = LlamaModel()

class BlogProcessRequest(BaseModel):
    blog_id: str

@app.get("/")
async def root():
    return {"message": "AI Blog Processing Worker is running"}

@app.post("/process-blog")
async def process_blog(request: BlogProcessRequest):
    """
    Process a blog post with AI
    - Receives blog_id from the main backend
    - Just logs the blog ID for now
    """
    try:
        blog_id = request.blog_id
        
        # Get blog from Node.js API
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://localhost:5000/api/blogs/{blog_id}")
            
            if response.status_code == 200:
                blog_data = response.json()
                print(f"Retrieved blog: {blog_data['title']}")
                
                #  Use Llama model for processing
                category = await llama_model.categorize_blog(blog_data['title'], blog_data['content'])
                summary = await llama_model.summarize_blog(blog_data['title'], blog_data['content'])
                tags = await llama_model.generate_tags(blog_data['title'], blog_data['content'])
                print(f"Category: {category}")
                print(f"Summary: {summary}")
                print(f"Generated Tags: {tags}")
                
                # Simple response
                return {
                    "blog_id": blog_id,
                    "status": "Processing",
                    "message": "Blog ID received successfully"
                }
            else:
                print(f"Failed to get blog: {response.status_code}")
                return {"error": "Failed to retrieve blog"}
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing blog: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-worker"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
