import feedparser
import httpx
from datetime import datetime
import asyncio

async def fetch_feed(url: str) -> list:
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            feed = feedparser.parse(response.text)
            
            articles = []
            for entry in feed.entries:
                articles.append({
                    "title": entry.get("title", "No Title"),
                    "url": entry.get("link", url),
                    "published": entry.get("published", datetime.now().isoformat()),
                    "description": entry.get("description", ""),
                    "publisher": feed.feed.get("title", "Unknown Publisher")
                })
            return articles
        except Exception as e:
            print(f"Failed to fetch {url}: {str(e)}")
            return []

async def get_latest_articles(urls: list[str], limit: int = 6) -> list[dict]:
    tasks = [fetch_feed(url) for url in urls]
    results = await asyncio.gather(*tasks)
    
    all_articles = []
    for res in results:
        all_articles.extend(res)
        
    # Deduplicate by URL
    seen_urls = set()
    unique_articles = []
    for article in all_articles:
        if article["url"] not in seen_urls:
            seen_urls.add(article["url"])
            unique_articles.append(article)
            
    # Naive sort assuming RSS provides roughly chronological data
    return unique_articles[:limit]