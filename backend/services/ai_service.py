import json
import os
import google.generativeai as genai
from google.api_core import exceptions
from dotenv import load_dotenv

load_dotenv()

# Define your fallback chain: (API_KEY_ENV_NAME, MODEL_NAME)
# UPDATED: Gemini 3.1 Flash Lite is now the primary driver to optimize free quota limits.
FALLBACK_CHAIN = [
    ("GEMINI_API_KEY", "gemini-3.1-flash-lite"), # <-- ADDED FIRST
    ("GEMINI_API_KEY", "gemini-3.5-flash"),
    ("GEMINI_API_KEY", "gemini-2.5-flash"),
    ("GEMINI_API_KEY", "gemini-2.0-flash"),
    # Optional secondary account backup strategy:
    ("GEMINI_API_KEY_BACKUP", "gemini-3.1-flash-lite"), # <-- ADDED BACKUP
    ("GEMINI_API_KEY_BACKUP", "gemini-2.5-flash"),
    ("GEMINI_API_KEY_BACKUP", "gemini-2.0-flash"),
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

    # Loop dynamically over our fallback chain configs
    for key_env_name, model_name in FALLBACK_CHAIN:
        api_key = os.getenv(key_env_name)
        
        # Skip if a backup key wasn't provided in your .env file
        if not api_key:
            continue

        try:
            print(f"🔄 Attempting briefing generation using: {model_name} via {key_env_name}...")
            
            # Switch client configuration over to the selected key
            genai.configure(api_key=api_key)
            
            model = genai.GenerativeModel(
                model_name,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Execute async text generation request
            response = await model.generate_content_async(prompt)
            
            # Successfully got response text, load and return it
            result = json.loads(response.text)
            print(f"✅ Success! Generated summary using model: {model_name}")
            return result

        except exceptions.ResourceExhausted as e:
            # Explicitly catches a 429 Quota/Rate Exceeded code from Gemini
            print(f"⚠️ Quota exhausted for {model_name} ({key_env_name}). Jumping to next fallback option...")
            continue
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON response from {model_name}: {str(e)}. Retrying fallback...")
            continue
            
        except Exception as e:
            # Handles unexpected connectivity issues but keeps the chain alive
            print(f"❌ Unexpected Error using {model_name}: {str(e)}")
            continue

    # If the loop naturally finishes without returning a valid dictionary layout
    raise Exception("All available fallback configurations or API keys are completely exhausted for the day.")