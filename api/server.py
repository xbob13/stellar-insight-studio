# api/server.py
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# --- Paths ----------------------------------------------------
HERE = Path(__file__).resolve().parent
ROOT = HERE.parent                      # repo root at runtime on Render
DIST = ROOT / "dist"                    # Vite build output (npm run build)
ASSETS_DIR = DIST / "assets"            # Vite assets
DATA_PATH = HERE / "data" / "spaceweather_sample.csv"

# --- App ------------------------------------------------------
app = FastAPI(title="Stellar Insight Studio")

# Serve built frontend assets
if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

def _load_df() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"CSV file not found: {DATA_PATH}")
    return pd.read_csv(DATA_PATH)

# --- Health ---------------------------------------------------
@app.get("/healthz", include_in_schema=False)
def healthz():
    status = "healthy" if DATA_PATH.exists() else "missing_csv"
    return {"status": status, "csv": str(DATA_PATH)}

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

    head = df.to_dict(orient="records")
    dtypes = {k: str(v) for k, v in df.dtypes.items()}

    return {
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "columns": list(df.columns),
        "head": head,
        "dtypes": dtypes,
    }

# --- API: summary --------------------------------------------
@app.get("/api/summary")
def summary():
    try:
        df = _load_df()
    except FileNotFoundError as e:
        return JSONResponse(status_code=404, content={"error": str(e)})

    out = {
        "file": DATA_PATH.name,
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
    }

    if "timestamp" in df.columns and not df.empty:
        out["time_range"] = {
            "first": str(df["timestamp"].iloc[0]),
            "last": str(df["timestamp"].iloc[-1]),
        }

    for col in ["kp_index", "solar_wind_speed_kms"]:
        if col in df.columns:
            out[col] = {
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "avg": float(df[col].mean()),
            }

    return out

# --- SPA: index + fallback -----------------------------------
def _index_response():
    index_path = DIST / "index.html"
    if not index_path.exists():
        return JSONResponse(
            status_code=500,
            content={
                "error": "Frontend build not found",
                "hint": "Ensure `npm run build` ran and /dist is present.",
            },
        )
    return FileResponse(index_path)

@app.get("/", include_in_schema=False)
def serve_index():
    return _index_response()

# Catch-all: send index.html for client-side routes (e.g. /dashboard)
@app.get("/{full_path:path}", include_in_schema=False)
def spa_fallback(full_path: str):
    if full_path.startswith("api") or full_path == "healthz":
        raise HTTPException(status_code=404, detail="Not Found")
    return _index_response()
