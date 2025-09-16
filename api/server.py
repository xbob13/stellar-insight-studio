from __future__ import annotations
import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===== config =====
CSV_URL = os.environ.get(
    "CSV_URL",
    "https://raw.githubusercontent.com/xbob13/stellar-insight-studio/data/spaceweather_base.csv",
)

app = FastAPI(title="Stellar Insight Studio API", version=os.environ.get("SIS_VERSION", "0.1.0"))

# allow frontend calls (we can tighten later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== models =====
class SummaryResponse(BaseModel):
    rows: int
    cols: int
    columns: list[str]
    head: list[dict]
    dtypes: dict[str, str]

# ===== routes =====
@app.get("/")
def root():
    return {"message": "Stellar Insight Studio API is running"}

@app.get("/healthz")
def health():
    return {"status": "healthy"}

@app.get("/api/summary", response_model=SummaryResponse)
def summary():
    try:
        df = pd.read_csv(CSV_URL)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load CSV: {e}")

    return SummaryResponse(
        rows=int(df.shape[0]),
        cols=int(df.shape[1]),
        columns=list(df.columns),
        head=df.head(10).to_dict(orient="records"),
        dtypes={k: str(v) for k, v in df.dtypes.items()},
    )
