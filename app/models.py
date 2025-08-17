from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class PaperBase(BaseModel):
    PPC_Id: str
    preprint_title: Optional[str] = None
    preprint_doi: Optional[str] = None
    preprint_subject: Optional[str] = None
    preprint_server: Optional[str] = None
    preprint_submission_date: Optional[str] = None
    all_authors: Optional[str] = None
    total_citation: Optional[int] = None
    country_name: Optional[str] = None

class Paper(PaperBase):
    """Complete paper model"""
    pass

class PaperSummary(BaseModel):
    """Summary model for paper listings"""
    PPC_Id: str
    preprint_title: Optional[str] = None
    total_citation: Optional[int] = None
    preprint_submission_date: Optional[str] = None
    all_authors: Optional[str] = None

class CountryData(BaseModel):
    country_name: str
    year: str
    count: int

class SearchResponse(BaseModel):
    papers: List[Paper]
    total: int
    page: int
    page_size: int
    has_next: bool

class AnalyticsResponse(BaseModel):
    timelineData: List[dict]
    subjectData: List[dict]
    serverData: List[dict]
    statisticsData: dict
    metadata: dict

class CitationDataResponse(BaseModel):
    impactData: List[dict]
    trendsData: List[dict]
    heatmapData: List[dict]
    topPapersData: List[dict]
    metadata: dict

class HealthResponse(BaseModel):
    status: str
    database: bool
    timestamp: datetime