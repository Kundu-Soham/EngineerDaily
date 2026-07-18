import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_briefing(articles: list[dict]) -> dict:
    if not articles:
        return {"overview": "No news available for this category today.", "summaries": []}

    prompt_data = [{"title": a["title"], "description": a["description"], "url": a["url"]} for a in articles]
    
    prompt = f"""
    You are an expert engineering journalist.
    Create a daily briefing from the provided articles.
    Never reproduce copyrighted text. Generate original summaries only.
    
    Respond strictly in JSON matching this schema:
    {{
      "overview": "A 150-200 word summary of major trends, announcements, and why today's news matters.",
      "summaries": [
        {{
          "url": "Must exactly match the provided article url",
          "summary": "A 50-80 word original summary of the specific article."
        }}
      ]
    }}
    
    Articles:
    {json.dumps(prompt_data)}
    """

    try:
        # gemini-1.5-flash is extremely fast and perfect for this use-case
        model = genai.GenerativeModel(
            'gemini-1.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )
        
        response = await model.generate_content_async(prompt)
        
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Gemini Generation Error: {str(e)}")
        raise e