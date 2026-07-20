from pydantic import BaseModel
from typing import List, Optional  # Added Optional

class Story(BaseModel):
    title: str
    publisher: str
    published: str
    summary: str
    url: str
    image_url: Optional[str] = None  # <-- ADD THIS LINE

class BriefingResponse(BaseModel):
    overview: str
    generated_at: str
    stories: List[Story]

class ErrorResponse(BaseModel):
    detail: str