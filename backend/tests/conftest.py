import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.analytics_service import AnalyticsService
from backend.services.ai_agent_service import AIScoutAgentService


@pytest.fixture(scope="session")
def client():
    """Session-scoped FastAPI TestClient instance."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def analytics_service():
    """Session-scoped AnalyticsService singleton fixture."""
    return AnalyticsService.get_instance()


@pytest.fixture(scope="session")
def scout_service():
    """Session-scoped AIScoutAgentService singleton fixture."""
    return AIScoutAgentService.get_instance()


@pytest.fixture(scope="session")
def sample_player_ids():
    """Common benchmark player IDs across different positions and leagues."""
    return {
        "saka": "bukayo_saka_eng_eng_2001_0",
        "haaland": "erling_haaland_nor_eng_2000_0",
        "saliba": "william_saliba_fra_fra_2001_0",
        "rodri": "rodrigo_hernandez_cascante_esp_eng_1996_0",
    }
