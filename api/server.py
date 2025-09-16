from __future__ import annotations

import os
from pathlib import Path
from typing import List, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse, JSONResponse

app = FastAPI(title="Stellar Insight Studio API")

# ---------- Paths & constants ----------
HERE = Path(__file__).parent
DEFAULT_DATA_DIR = HERE / "data"
DEFAULT_DATA_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_CSV_NAME = "spaceweather_sample.csv"
CSV_ENV = os.getenv("DATA_CSV", DEFAULT_CSV_NAME)

# If an absolute path is provided via env, use it; else look in api/data/
CSV_PATH = Path(CSV_ENV)
if not CSV_PATH.is_absolute():
    CSV_PATH = DEFAULT_DATA_DIR / CSV_ENV


SAMPLE_ROWS = [
    {"timestamp": "2025-09-15T00:00:00Z", "kp_index": 3, "solar_wind_speed_kms": 410},
    {"timestamp": "2025-09-15T01:00:00Z", "kp_index": 4, "solar_wind_speed_kms": 420},
    {"timestamp": "2025-09-15T02:00:00Z", "kp_index": 5, "solar_wind_speed_kms": 515},
    {"timestamp": "2025-09-15T03:00:00Z", "kp_index": 2, "solar_wind_speed_kms": 380},
    {"timestamp": "2025-09-15T04:00:00Z", "kp_index": 1, "solar_wind_speed_kms": 360},
    {"timestamp": "2025-09-15T05:00:00Z", "kp_index": 3, "solar_wind_speed_kms": 405},
]


def ensure_csv_exists() -> None:
    """Create a sane default CSV if it's missing so endpoints never 404."""
    if not CSV_PATH.exists():
        df = pd.DataFrame(SAMPLE_ROWS)
        CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(CSV_PATH, index=False)


def load_df() -> pd.DataFrame:
    ensure_csv_exists()
    if not CSV_PATH.exists():
        # Should not happen due to ensure_csv_exists, but keep a clear error.
        raise FileNotFoundError(f"CSV file not found: {CSV_PATH.name}")
    df = pd.read_csv(CSV_PATH)
    # normalize/validate columns if needed
    expected = {"timestamp", "kp_index", "solar_wind_speed_kms"}
    missing = expected - set(df.columns)
    if missing:
        raise ValueError(f"CSV is missing columns: {', '.join(sorted(missing))}")
    return df


@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <html>
      <head><title>Stellar Insight Studio API</title></head>
      <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px">
        <h1>Stellar Insight Studio</h1>
        <p>Backend is running. Useful endpoints:</p>
        <ul>
          <li><a href="/healthz">/healthz</a></li>
          <li><a href="/api/data">/api/data</a></li>
          <li><a href="/api/summary">/api/summary</a></li>
        </ul>
      </body>
    </html>
    """


@app.get("/healthz")
def healthz():
    try:
        ensure_csv_exists()
        return {"status": "healthy", "csv": str(CSV_PATH)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "unhealthy", "error": str(e)})


@app.get("/api/data")
def get_data(
    limit: Optional[int] = Query(None, ge=1, le=10000),
    columns: Optional[str] = Query(None, description="Comma-separated list of columns"),
):
    """
    Example:
      /api/data?limit=6
      /api/data?limit=6&columns=timestamp,kp_index,solar_wind_speed_kms
    """
    try:
        df = load_df()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if columns:
        wanted = [c.strip() for c in columns.split(",") if c.strip()]
        bad = [c for c in wanted if c not in df.columns]
        if bad:
            raise HTTPException(status_code=400, detail=f"Unknown columns: {', '.join(bad)}")
        df = df[wanted]

    if limit is not None:
        df = df.head(limit)

    # Build a compact payload with head + simple dtypes
    dtypes = {k: str(v) for k, v in df.dtypes.to_dict().items()}
    return {
        "rows": len(df),
        "cols": len(df.columns),
        "columns": list(df.columns),
        "head": df.to_dict(orient="records"),
        "dtypes": dtypes,
    }


@app.get("/api/summary")
def summary():
    try:
        df = load_df()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Coerce timestamp to datetime (safe even if already str)
    ts = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
    kp = pd.to_numeric(df["kp_index"], errors="coerce")
    sw = pd.to_numeric(df["solar_wind_speed_kms"], errors="coerce")

    payload = {
        "file": str(CSV_PATH.name),
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "time_range": {
            "first": ts.min().isoformat() if ts.notna().any() else None,
            "last": ts.max().isoformat() if ts.notna().any() else None,
        },
        "kp_index": {
            "min": float(kp.min()) if kp.notna().any() else None,
            "max": float(kp.max()) if kp.notna().any() else None,
            "avg": float(kp.mean()) if kp.notna().any() else None,
        },
        "solar_wind_speed_kms": {
            "min": float(sw.min()) if sw.notna().any() else None,
            "max": float(sw.max()) if sw.notna().any() else None,
            "avg": float(sw.mean()) if sw.notna().any() else None,
        },
    }
    return payload
