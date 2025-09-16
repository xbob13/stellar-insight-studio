# api/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
import os
import pandas as pd

app = FastAPI(title="Stellar Insight Studio API")

# Allow the frontend to call this API from the Static Site domain
# You can tighten this later by putting your exact static-site URL in the list.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # e.g. ["https://YOUR-STATIC-SITE.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/")
def root():
    return PlainTextResponse("Stellar Insight Studio API is running.")

@app.get("/api/summary")
def api_summary():
    """
    Returns a compact summary of the CSV (first 6 rows + schema).
    Path can be set with env var CSV_PATH; falls back to 'spaceweather_sample.csv'.
    """
    csv_path = os.getenv("CSV_PATH", "spaceweather_sample.csv")
    if not os.path.exists(csv_path):
        return JSONResponse(
            status_code=404,
            content={"error": f"CSV file not found: {csv_path}"}
        )

    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    payload = {
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "columns": list(df.columns),
        "head": df.head(6).to_dict(orient="records"),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
    }
    return payload
