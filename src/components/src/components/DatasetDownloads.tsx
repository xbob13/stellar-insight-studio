import { useEffect, useState } from "react"
import { fetchManifest, type DatasetManifest } from "@/lib/manifest"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DatasetDownloads() {
  const [m, setM] = useState<DatasetManifest | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const manifest = await fetchManifest()
        setM(manifest)
      } catch (e: any) {
        setErr(e?.message || "Failed to load dataset manifest")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Card className="mx-4 md:mx-8 my-8">
      <CardHeader>
        <CardTitle>Dataset downloads</CardTitle>
        <CardDescription>
          Always points to the latest hourly build (CSV &amp; Parquet).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-sm text-muted-foreground">Loading latest dataset…</div>}
        {!loading && err && <div className="text-sm text-red-600">{err}</div>}
        {!loading && m && (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(m.updated_utc).toUTCString()}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><a href={m.csv_url} download>Download CSV</a></Button>
              <Button variant="outline" asChild><a href={m.parquet_url} download>Download Parquet</a></Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
