from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime
import os
from pathlib import Path

from models.schemas import BriefingResponse, Story
from services.rss_service import get_latest_articles
from services.ai_service import generate_briefing

app = FastAPI(title="Engineer Daily API")

# Allow all origins so your Vercel frontend can talk to your Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "sources.json"

def load_sources():
    try:
        with open(DATA_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {}

@app.get("/categories")
async def get_categories():
    sources = load_sources()
    mapping = {
        "ai": "AI & Tech",
        "mechanical": "Mechanical",
        "electrical": "Electrical",
        "civil": "Civil",
        "chemical": "Chemical",
        "materials": "Materials"
    }
    return [{"id": k, "name": mapping.get(k, k.title())} for k in sources.keys()]

@app.get("/briefing/{category}", response_model=BriefingResponse)
async def get_briefing(category: str):
    sources = load_sources()
    if category not in sources:
        raise HTTPException(status_code=404, detail="Category not found")
        
    urls = sources[category]
    if not urls:
        raise HTTPException(status_code=400, detail="No RSS sources configured for this category")

    try:
        # 1. Fetch & Dedupe
        articles = await get_latest_articles(urls, limit=6)
        if not articles:
            raise HTTPException(status_code=502, detail="Failed to fetch articles from upstream sources")

        # 2. Generate AI Briefing
        ai_response = await generate_briefing(articles)
        
        # 3. Merge AI summaries with Original Article Metadata
        stories = []
        for article in articles:
            ai_summary_text = "Summary unavailable."
            for ai_item in ai_response.get("summaries", []):
                if ai_item.get("url") == article["url"]:
                    ai_summary_text = ai_item.get("summary")
                    break
                    
            stories.append(Story(
                title=article["title"],
                publisher=article["publisher"],
                published=article["published"][:16].replace("T", " ") if "T" in article["published"] else article["published"][:25],
                summary=ai_summary_text,
                url=article["url"]
            ))

        return BriefingResponse(
            overview=ai_response.get("overview", "Overview unavailable."),
            generated_at=datetime.now().isoformat(),
            stories=stories
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate briefing: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)