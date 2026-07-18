from pydantic import BaseModel
from typing import List

class Story(BaseModel):
    title: str
    publisher: str
    published: str
    summary: str
    url: str

class BriefingResponse(BaseModel):
    overview: str
    generated_at: str
    stories: List[Story]

class ErrorResponse(BaseModel):
    detail: str