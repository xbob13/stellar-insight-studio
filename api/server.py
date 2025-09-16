# api/server.py
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# --- Paths ----------------------------------------------------
HERE = Path(__file__).resolve().parent         # .../src/api
SRC_ROOT = HERE.parent                         # .../src
REPO_ROOT = SRC_ROOT.parent                    # repo root
# Try both common Vite build locations
CANDIDATE_DIST_DIRS = [
    SRC_ROOT / "dist",                         # /src/dist  (when building from /src)
    REPO_ROOT / "dist",                        # /dist      (when building from repo root)
]
DIST = next((d for d in CANDIDATE_DIST_DIRS if (d / "index.html").exists()), None)
ASSETS_DIR = DIST / "assets" if DIST else None

DATA_PATH = HERE / "data" / "spaceweather_sample.csv"

# --- App ------------------------------------------------------
app = FastAPI(title="Stellar Insight Studio")

if ASSETS_DIR and ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

def _load_df() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"CSV file not found: {DATA_PATH}")
    return pd.read_csv(DATA_PATH)

# --- Health ---------------------------------------------------
@app.get("/healthz", include_in_schema=False)
def healthz():
    return {
        "status": "healthy" if DATA_PATH.exists() and DIST else "missing_parts",
        "csv": str(DATA_PATH),
        "dist": str(DIST) if DIST else None,
    }

# --- API: data -----------------------------------------------
@app.get("/api/data")
def get_data(limit: Optional[int] = None, columns: Optional[str] = None):
    try:
        df = _load_df()
    except FileNotFoundError as e:
        return JSONResponse(status_code=404, content={"error": str(e)})

    if columns:
        requested = [c.strip() for c in columns.split(",") if c.strip()]
        df = df[[c for c in requested if c in df.columns]]

    if limit is not None:
        df = df.head(limit)

    return {
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "columns": list(df.columns),
        "head": df.to_dict(orient="records"),
        "dtypes": {k: str(v) for k, v in df.dtypes.items()},
    }

# --- API: summary --------------------------------------------
@app.get("/api/summary")
def summary():
    try:
        df = _load_df()
    except FileNotFoundError as e:
        return JSONResponse(status_code=404, content={"error": str(e)})

    out = {"file": DATA_PATH.name, "rows": int(df.shape[0]), "cols": int(df.shape[1])}
    if "timestamp" in df.columns and not df.empty:
        out["time_range"] = {"first": str(df["timestamp"].iloc[0]), "last": str(df["timestamp"].iloc[-1])}
    for col in ["kp_index", "solar_wind_speed_kms"]:
        if col in df.columns:
            out[col] = {"min": float(df[col].min()), "max": float(df[col].max()), "avg": float(df[col].mean())}
    return out

# --- SPA: index + fallback -----------------------------------
def _index_response():
    if not DIST:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Frontend build not found",
                "hint": "Ensure the build step runs and produces /dist",
                "looked_in": [str(p) for p in CANDIDATE_DIST_DIRS],
            },
        )
    return FileResponse(DIST / "index.html")

@app.get("/", include_in_schema=False)
def serve_index():
    return _index_response()

@app.get("/{full_path:path}", include_in_schema=False)
def spa_fallback(full_path: str):
    if full_path.startswith("api") or full_path == "healthz":
        raise HTTPException(status_code=404, detail="Not Found")
    return _index_response()
