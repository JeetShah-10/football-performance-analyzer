from fastapi import FastAPI

app = FastAPI(title="Football Player Style API")

@app.get("/")
def read_root():
    return {"status": "ok"}
