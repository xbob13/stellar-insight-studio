export type DatasetManifest = {
  updated_utc: string
  csv_url: string
  parquet_url: string
  schema_url?: string
  readme_url?: string
}

export async function fetchManifest(): Promise<DatasetManifest> {
  const url = import.meta.env.VITE_DATASET_MANIFEST_URL
  if (!url) throw new Error("VITE_DATASET_MANIFEST_URL not set")

  // cache-busting query param ensures Render doesn’t serve stale data
  const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`manifest fetch failed: ${res.status}`)
  }

  return res.json()
}
