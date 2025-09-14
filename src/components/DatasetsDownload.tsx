import { useEffect, useState } from "react";

const DatasetsDownload = () => {
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_DATASET_MANIFEST_URL)
      .then((res) => res.json())
      .then(setMeta)
      .catch((err) => console.error("Failed to load manifest", err));
  }, []);

  if (!meta) {
    return <p className="p-4">Loading dataset metadata…</p>;
  }

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
        >
          Download CSV
        </a>
        <a
          href={meta.parquet_url}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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
      </div>
    </section>
  );
};

export default DatasetsDownload;
