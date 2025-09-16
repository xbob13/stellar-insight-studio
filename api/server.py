# api/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
import os
import pandas as pd

app = FastAPI(title="Stellar Insight Studio API")

# CORS — keep permissive for now (tighten later to your static site URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _load_df():
    """Load the CSV indicated by CSV_PATH (or default), return a pandas DataFrame."""
    csv_path = os.getenv("CSV_PATH", "spaceweather_sample.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")
    return pd.read_csv(csv_path)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/")
def root():
    return PlainTextResponse("Stellar Insight Studio API is running.")

@app.get("/api/summary")
def api_summary():
    """
    Compact summary of the CSV (first 6 rows + schema).
    """
    try:
        df = _load_df()
    except Exception as e:
        return JSONResponse(status_code=404, content={"error": str(e)})

    payload = {
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "columns": list(df.columns),
        "head": df.head(6).to_dict(orient="records"),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
    }
    return payload

@app.get("/api/data")
def api_data(limit: int = 500, columns: str = "timestamp,kp_index,solar_wind_speed_kms"):
    """
    Row-oriented data for charts.
    - limit: max rows returned (default 500)
    - columns: comma-separated list of columns to include
    """
    try:
        df = _load_df()
    except Exception as e:
        return JSONResponse(status_code=404, content={"error": str(e)})

    # Column selection
    requested_cols = [c.strip() for c in columns.split(",") if c.strip()]
    existing = [c for c in requested_cols if c in df.columns]
    if not existing:
        return JSONResponse(
            status_code=400,
            content={"error": "No requested columns found in CSV.", "requested": requested_cols, "available": list(df.columns)},
        )

    # Try to normalize timestamp for sorting if present
    if "timestamp" in df.columns:
        df["__ts__"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
        df = df.dropna(subset=["__ts__"]).sort_values("__ts__", ascending=True)
    else:
        df = df.sort_index()

    df = df[existing].tail(limit)

    # Ensure timestamps are ISO strings if included
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True).dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "count": int(df.shape[0]),
        "columns": list(df.columns),
        "rows": df.to_dict(orient="records"),
    }
