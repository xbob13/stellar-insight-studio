import { useEffect, useState } from "react"
import { fetchManifest, type DatasetManifest } from "@/lib/manifest"

export default function DatasetDownloads() {
  const [m, setM] = useState<DatasetManifest | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { setM(await fetchManifest()) }
      catch (e: any) { setErr(e?.message || "Failed to load dataset manifest") }
    })()
  }, [])

  if (err) return <div className="text-red-600 text-sm">{err}</div>
  if (!m)  return <div className="text-sm opacity-70">Loading latest dataset…</div>

  const nice = new Date(m.updated_utc).toUTCString()

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs opacity-70">Last updated: {nice}</div>
      <div className="flex gap-3">
        <a href={m.csv_url} className="px-3 py-2 rounded bg-black text-white text-sm" download>
          Download CSV
        </a>
        <a href={m.parquet_url} className="px-3 py-2 rounded border text-sm" download>
          Download Parquet
        </a>
      </div>
    </div>
  )
}
