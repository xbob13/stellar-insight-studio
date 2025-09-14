// src/components/DatasetsDownload.tsx
import { useEffect, useState } from "react";

type Manifest = {
  updated_utc: string;
  csv_url: string;
  parquet_url: string;
  schema_url?: string;
  readme_url?: string;
};

export default function DatasetsDownload() {
  const [meta, setMeta] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_DATASET_MANIFEST_URL;
    if (!url) {
      setErr("VITE_DATASET_MANIFEST_URL not set");
      setLoading(false);
      return;
    }
    fetch(`${url}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: Manifest) => setMeta(data))
      .catch((e: any) => setErr(e?.message || "Failed to load manifest"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="p-6">Loading dataset metadata…</section>;

  if (err)
    return (
      <section className="p-6">
        <div className="text-sm text-red-600">{err}</div>
      </section>
    );

  if (!meta) return null;

  return (
    <section className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Download Space Weather Dataset</h2>
      <p className="mb-2 text-sm text-gray-500">
        Last updated: {new Date(meta.updated_utc).toUTCString()}
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a
          href={meta.csv_url}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          download
        >
          Download CSV
        </a>
        <a
          href={meta.parquet_url}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          download
        >
          Download Parquet
        </a>
        <a
          href={import.meta.env.VITE_DATASET_MANIFEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
        >
          View manifest JSON
        </a>
        {meta.schema_url && (
          <a
            href={meta.schema_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            View schema
          </a>
        )}
        {meta.readme_url && (
          <a
            href={meta.readme_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            View README
          </a>
        )}
      </div>
    </section>
  );
}
