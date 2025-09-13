#!/usr/bin/env python3
# Space-Weather Dataset Builder — one file
# - Pulls GFZ Kp (3-hourly) and NOAA GOES X-ray (recent)
# - Merges to hourly UTC, writes CSV + Parquet
# - Kyoto Dst + NASA OMNI stubs included (optional to wire later)
# - Continues even if a source fails

import os, sys, argparse, requests, pandas as pd
from datetime import datetime
from typing import Optional

# ------------------ Helpers ------------------

def to_utc(ts) -> pd.Timestamp:
    return pd.to_datetime(ts, utc=True)

def hourly_index(df: pd.DataFrame, tcol="time_utc") -> pd.DataFrame:
    if df.empty: return df
    d = df.copy()
    d[tcol] = pd.to_datetime(d[tcol], utc=True)
    return d.set_index(tcol).sort_index()

def write_outputs(df: pd.DataFrame, outdir: str, name: str):
    os.makedirs(outdir, exist_ok=True)
    csv_path = os.path.join(outdir, f"{name}.csv")
    pq_path  = os.path.join(outdir, f"{name}.parquet")
    df.to_csv(csv_path, index=True)
    try:
        df.to_parquet(pq_path, index=True)
    except Exception as e:
        print(f"[WARN] Parquet write failed ({e}). CSV written: {csv_path}")
    print(f"✅ Wrote: {csv_path}")

# ------------------ Loaders ------------------

def fetch_gfz_kp(start_iso: str, end_iso: str) -> pd.DataFrame:
    """GFZ Kp via JSON API (index=C9). Returns 3-hour cadence."""
    base = "https://kp.gfz.de/app/json/"
    params = {"start": start_iso, "end": end_iso, "index": "C9", "status": "def"}
    r = requests.get(base, params=params, timeout=60)
    r.raise_for_status()
    js = r.json()
    rows = []
    for item in js.get("data", []):
        rows.append({"time_utc": item["time"], "kp": float(item["value"])})
    df = pd.DataFrame(rows)
    if df.empty: return df
    df["time_utc"] = to_utc(df["time_utc"])
    return df.sort_values("time_utc")

def fetch_noaa_goes_xrs_recent(days:int=14) -> pd.DataFrame:
    """NOAA SWPC GOES X-ray JSON (recent)."""
    endpoints = [
        "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json",
        "https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json",
    ]
    frames = []
    for url in endpoints:
        try:
            r = requests.get(url, timeout=60); r.raise_for_status()
            js = r.json()
            d = pd.json_normalize(js)
            if "time_tag" in d.columns:
                d["time_utc"] = to_utc(d["time_tag"])
                d = d[["time_utc","flux","energy","satellite"]]
                frames.append(d)
        except Exception as e:
            print(f"[WARN] GOES fetch failed from {url}: {e}")
    if not frames: return pd.DataFrame(columns=["time_utc","goes_xray_flux"])
    df = pd.concat(frames, ignore_index=True).drop_duplicates(subset=["time_utc"])
    df = df.sort_values("time_utc")
    h = hourly_index(df).resample("1H").max(numeric_only=True)
    h = h.rename(columns={"flux":"goes_xray_flux"})
    h = h.reset_index()
    return h

def fetch_kyoto_dst_range(start: datetime, end: datetime) -> pd.DataFrame:
    """Placeholder for Kyoto Dst hourly loader."""
    return pd.DataFrame(columns=["time_utc","Dst"])

def fetch_nasa_omni_hourly(start: datetime, end: datetime) -> pd.DataFrame:
    """Placeholder for NASA OMNI hourly solar wind/IMF loader."""
    cols = ["time_utc","Vsw_km_s","Np_cm3","T_K","IMF_Bz_nT"]
    return pd.DataFrame(columns=cols)

# ------------------ Normalize / Merge ------------------

def expand_kp_to_hourly(kp_df: pd.DataFrame) -> pd.DataFrame:
    """Kp is 3-hourly; expand/forward-fill to hourly."""
    if kp_df.empty: return kp_df
    k = hourly_index(kp_df)
    rng = pd.date_range(k.index.min().floor("H"), k.index.max().ceil("H"), freq="1H", tz="UTC")
    h = k.reindex(rng).ffill()
    h.index.name = "time_utc"
    return h.reset_index()

def hourly_outer_join(dfs: list) -> pd.DataFrame:
    """Outer-join multiple hourly dataframes on time_utc."""
    hourly = []
    for d in dfs:
        if d is None or d.empty: continue
        di = hourly_index(d)
        di = di.resample("1H").mean(numeric_only=True)
        hourly.append(di)
    if not hourly:
        return pd.DataFrame(columns=["time_utc"])
    out = hourly[0]
    for di in hourly[1:]:
        out = out.join(di, how="outer")
    out = out.sort_index().reset_index().rename(columns={"index":"time_utc"})
    return out

# ------------------ Product Build ------------------

def build_spaceweather(start: str, end: str, outdir: str):
    start_dt = pd.to_datetime(start, utc=True)
    end_dt   = pd.to_datetime(end,   utc=True)

    print("[*] Fetching GFZ Kp…")
    kp_raw = fetch_gfz_kp(start_dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
                          end_dt.strftime("%Y-%m-%dT%H:%M:%SZ"))
    kp_h = expand_kp_to_hourly(kp_raw)

    print("[*] (Optional) Fetching Kyoto Dst…")
    dst_h = fetch_kyoto_dst_range(start_dt, end_dt)

    print("[*] (Optional) Fetching NASA OMNI hourly…")
    omni_h = fetch_nasa_omni_hourly(start_dt, end_dt)

    print("[*] Fetching NOAA GOES X-ray (recent)…")
    goes_h = fetch_noaa_goes_xrs_recent(days=14)

    print("[*] Merging to hourly…")
    parts = []
    if not kp_h.empty:   parts.append(kp_h.rename(columns={"kp":"Kp"}))
    if not dst_h.empty:  parts.append(dst_h.rename(columns={"Dst":"Dst"}))
    if not omni_h.empty: parts.append(omni_h)
    if not goes_h.empty: parts.append(goes_h)

    final = hourly_outer_join(parts)

    ordered = ["time_utc","Kp","Dst","Vsw_km_s","Np_cm3","T_K","IMF_Bz_nT","goes_xray_flux"]
    for col in ordered:
        if col not in final.columns:
            final[col] = pd.NA
    final = final[ordered].sort_values("time_utc")

    if not final.empty:
        m = (final["time_utc"] >= start_dt) & (final["time_utc"] <= end_dt)
        final = final.loc[m]

    write_outputs(final, outdir, "spaceweather_base")

    print("Done.")
    return final

# ------------------ CLI ------------------

def main():
    ap = argparse.ArgumentParser(description="Build a sellable space-weather dataset (hourly).")
    ap.add_argument("--start", help="YYYY-MM-DD")
    ap.add_argument("--end", help="YYYY-MM-DD")
    ap.add_argument("--days", type=int, help="Alternative: number of days back from now")
    ap.add_argument("--out", default="./export", help="output folder")
    args = ap.parse_args()

    if args.days:
        end = datetime.utcnow()
        start = end - pd.Timedelta(days=args.days)
        build_spaceweather(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d"), args.out)
    else:
        build_spaceweather(args.start, args.end, args.out)

if __name__ == "__main__":
    sys.exit(main())
