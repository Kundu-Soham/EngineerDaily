import feedparser
import httpx
from datetime import datetime
import asyncio

async def fetch_feed(url: str) -> list:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    async with httpx.AsyncClient(timeout=20.0, headers=headers) as client:
        try:
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()
            feed = feedparser.parse(response.text)
            
            articles = []
            for entry in feed.entries:
                # --- ADD IMAGE EXTRACTION LOGIC HERE ---
                image_url = None
                
                # 1. Check standard attachments/enclosures
                if 'enclosures' in entry and len(entry.enclosures) > 0:
                    image_url = entry.enclosures[0].get('href')
                
                # 2. Check Media RSS specifications (<media:content>)
                elif 'media_content' in entry and len(entry.media_content) > 0:
                    image_url = entry.media_content[0].get('url')
                    
                # 3. Check for thumbnail tags (<media:thumbnail>)
                elif 'media_thumbnail' in entry and len(entry.media_thumbnail) > 0:
                    image_url = entry.media_thumbnail[0].get('url')
                # ----------------------------------------

                articles.append({
                    "title": entry.get("title", "No Title"),
                    "url": entry.get("link", url),
                    "published": entry.get("published", datetime.now().isoformat()),
                    "description": entry.get("description", ""),
                    "publisher": feed.feed.get("title", "Unknown Publisher"),
                    "image_url": image_url  # <-- ADD THIS TO THE DICTIONARY
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