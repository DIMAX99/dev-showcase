from together import Together
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LlamaModel:
    def __init__(self):
        # API key will be automatically detected from TOGETHER_API_KEY environment variable
        self.client = Together()
        self.model_name = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
    
    async def generate_response(self, messages, temperature=0, stream=True):
        """
        Generate response using Llama model from Together.ai
        
        Args:
            messages: List of message objects for the chat
            temperature: Sampling temperature (0 for deterministic)
            stream: Whether to stream the response
        
        Returns:
            Response from the model
        """
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=temperature,
            stream=stream
        )
        
        if stream:
            # For streaming response
            full_response = ""
            for token in response:
                if hasattr(token, 'choices'):
                    content = token.choices[0].delta.content
                    if content:
                        full_response += content
                        print(content, end='', flush=True)
            return full_response
        else:
            # For non-streaming response
            return response.choices[0].message.content
    
    async def categorize_blog(self, title, content):
        """
        Categorize blog post using Llama model
        
        Args:
            title: Blog title
            content: Blog content
        
        Returns:
            Category classification
        """
        messages = [
            {
                "role": "system",
                "content": "You are a technical blog classifier. "
                "Classify the given blog into ONE category from: Web Development, Mobile Development, AI/Machine Learning, Data Science, DevOps, Cybersecurity, Backend Development, Frontend Development, Cloud Computing, Blockchain. "
                "Return only the categories the blog belongs to."
            },
            {
                "role": "user",
                "content": f"Title: {title}\nContent: {content[:500]}..."
            }
        ]
        
        return await self.generate_response(messages, temperature=0, stream=False)
    
    async def summarize_blog(self, title, content):
        """
        Summarize blog post using Llama model
        
        Args:
            title: Blog title
            content: Blog content
        
        Returns:
            Blog summary
        """
        messages = [
            {
                "role": "system",
                "content": "You are a technical content summarizer. Create a concise 2-3 sentence summary of the given blog post."
                "Return only the summary."
            },
            {
                "role": "user",
                "content": f"Title: {title}\nContent: {content}"
            }
        ]
        
        return await self.generate_response(messages, temperature=0, stream=False)
    
    async def generate_tags(self, title, content):
        """
        Generate tags for blog post using Llama model
        
        Args:
            title: Blog title
            content: Blog content
        
        Returns:
            Generated tags as comma-separated string
        """
        messages = [
            {
                "role": "system",
                "content": "You are a technical tag generator. Generate 5-8 relevant tags for this blog post. Return only the tags separated by commas (e.g., react, javascript, frontend, hooks, performance)."
            },
            {
                "role": "user",
                "content": f"Title: {title}\nContent: {content[:800]}..."
            }
        ]
        
        return await self.generate_response(messages, temperature=0, stream=False)
