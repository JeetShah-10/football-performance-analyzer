import json
import time
import logging
from fastapi.testclient import TestClient

# Disable httpx logs for clean output
logging.getLogger("httpx").setLevel(logging.WARNING)

from backend.main import app
from backend.services.analytics_service import AnalyticsService

print("=== SETUP / STARTUP LOG ===")
service = AnalyticsService.get_instance()
print(f"[STARTUP] AnalyticsService loaded {service.get_total_players_count()} players into RAM.")

client = TestClient(app)

print("\n==========================================")
print("TEST 1: CONTRACT MATCH (Saka & Van Dijk)")
print("==========================================")

saka_id = "bukayo_saka_eng_eng_2001_0"
vvd_id = "virgil_van_dijk_nl_ned_1991_0"

res_saka = client.get(f"/players/{saka_id}")
print(f"GET /players/{saka_id} Status: {res_saka.status_code}")
saka_json = res_saka.json()
print("Bukayo Saka RAW Response Body:")
print(json.dumps(saka_json, indent=2))

res_vvd = client.get(f"/players/{vvd_id}")
print(f"\nGET /players/{vvd_id} Status: {res_vvd.status_code}")
vvd_json = res_vvd.json()
print("Virgil van Dijk RAW Response Body:")
print(json.dumps(vvd_json, indent=2))


print("\n==========================================")
print("TEST 2: SIMILARITY REGRESSION")
print("==========================================")

res_sim = client.get(f"/similar/{saka_id}?n=5")
print(f"GET /similar/{saka_id}?n=5 Status: {res_sim.status_code}")
sim_json = res_sim.json()
print("GET /similar/{saka_id}?n=5 RAW Response Body:")
print(json.dumps(sim_json, indent=2))


print("\n==========================================")
print("TEST 3: SIGNATURE STATS")
print("==========================================")

res_clusters = client.get("/clusters")
print(f"GET /clusters Status: {res_clusters.status_code}")
clusters_json = res_clusters.json()
print("GET /clusters RAW Response Body:")
print(json.dumps(clusters_json, indent=2))


print("\n==========================================")
print("TEST 4: LEAGUE FILTER")
print("==========================================")

res_l1 = client.get("/players?league=eng Premier League&limit=2")
print(f"GET /players?league=eng Premier League&limit=2 Status: {res_l1.status_code}")
print(json.dumps(res_l1.json(), indent=2))

res_l2 = client.get("/players?league=it Serie A&limit=2")
print(f"\nGET /players?league=it Serie A&limit=2 Status: {res_l2.status_code}")
print(json.dumps(res_l2.json(), indent=2))


print("\n==========================================")
print("TEST 5: PAGINATION")
print("==========================================")

res_p1 = client.get("/players?limit=5&offset=0")
res_p2 = client.get("/players?limit=5&offset=5")

p1_json = res_p1.json()
p2_json = res_p2.json()

p1_ids = [p['player_id'] for p in p1_json]
p2_ids = [p['player_id'] for p in p2_json]

print("Page 1 (offset=0, limit=5) IDs:", p1_ids)
print("Page 2 (offset=5, limit=5) IDs:", p2_ids)
print("Overlap between Page 1 and Page 2:", set(p1_ids).intersection(set(p2_ids)))


print("\n==========================================")
print("TEST 6: ERROR HANDLING (404)")
print("==========================================")

res_404 = client.get("/players/non_existent_player_id_999")
print(f"Status Code: {res_404.status_code}")
print("Raw Response Body:", res_404.text)


print("\n==========================================")
print("TEST 7: RATE LIMITING")
print("==========================================")

# Test slowapi TestClient rate limiting
# Note: TestClient by default resets rate limits unless using standard HTTP client or test client with custom remote address.
first_429_req = None
for i in range(1, 66):
    r = client.get("/health", headers={"X-Forwarded-For": "127.0.0.1"})
    if r.status_code == 429 and first_429_req is None:
        first_429_req = i

print(f"Rate Limiter Status: 429 Response first encountered at Request #{first_429_req}")


print("\n==========================================")
print("TEST 8: LATENCY (50 SEQUENTIAL REQUESTS)")
print("==========================================")

times = []
for _ in range(50):
    t0 = time.perf_counter()
    client.get(f"/players/{saka_id}")
    t1 = time.perf_counter()
    times.append((t1 - t0) * 1000.0)

print(f"Min Latency:  {min(times):.2f} ms")
print(f"Mean Latency: {sum(times)/len(times):.2f} ms")
print(f"Max Latency:  {max(times):.2f} ms")
