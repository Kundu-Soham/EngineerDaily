import json
import os
import google.generativeai as genai
from google.api_core import exceptions
from dotenv import load_dotenv

load_dotenv()

# Define your fallback chain: (API_KEY_ENV_NAME, MODEL_NAME)
# Added the explicit "models/" prefix namespace to ensure the legacy SDK maps it perfectly
FALLBACK_CHAIN = [
    ("GEMINI_API_KEY", "models/gemini-3.1-flash-lite"), 
    ("GEMINI_API_KEY", "models/gemini-3.5-flash"),
    ("GEMINI_API_KEY", "models/gemini-2.5-flash"),
    ("GEMINI_API_KEY", "models/gemini-2.0-flash"),
    # Optional secondary account backup strategy:
    ("GEMINI_API_KEY_BACKUP", "models/gemini-3.1-flash-lite"), 
    ("GEMINI_API_KEY_BACKUP", "models/gemini-2.5-flash"),
    ("GEMINI_API_KEY_BACKUP", "models/gemini-2.0-flash"),
]

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

    for key_env_name, model_name in FALLBACK_CHAIN:
        api_key = os.getenv(key_env_name)
        
        if not api_key:
            continue

        try:
            print(f"🔄 Attempting briefing generation using: {model_name} via {key_env_name}...")
            
            genai.configure(api_key=api_key)
            
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={"response_mime_type": "application/json"}
            )
            
            response = await model.generate_content_async(prompt)
            
            result = json.loads(response.text)
            print(f"✅ Success! Generated summary using model: {model_name}")
            return result

        except exceptions.ResourceExhausted as e:
            print(f"⚠️ Quota exhausted for {model_name} ({key_env_name}). Jumping to next fallback option...")
            continue
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON response from {model_name}: {str(e)}. Retrying fallback...")
            continue
            
        except Exception as e:
            # IMPROVED: This will now print the exact underlying error message to your terminal 
            # so you can see if it's an authentication, package, or model mismatch issue.
            print(f"❌ Unexpected Error using {model_name}: {repr(e)}")
            continue

    raise Exception("All available fallback configurations or API keys are completely exhausted for the day.")