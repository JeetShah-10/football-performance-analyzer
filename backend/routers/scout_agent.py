from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Request
from backend.services.ai_agent_service import AIScoutAgentService
from backend.limiter import limiter

router = APIRouter(tags=["AI Scout Agent"])

class ScoutAgentRequest(BaseModel):
    query: str

class ScoutAgentResponse(BaseModel):
    query: str
    predicted_intent: str
    extracted_entities: Dict[str, Any]
    backend_methods_called: List[str]
    report_markdown: str
    intent: Optional[str] = None
    entities: Optional[Dict[str, Any]] = None
    synthesized_response: Optional[str] = None
    players_data: Optional[List[Dict[str, Any]]] = None
    latency_ms: Optional[float] = None


@router.post("/scout-agent/query", response_model=ScoutAgentResponse)
@limiter.limit("60/minute")
def query_scout_agent(request: Request, body: ScoutAgentRequest):
    agent_service = AIScoutAgentService.get_instance()
    res = agent_service.process_query(body.query)
    return ScoutAgentResponse(**res)
