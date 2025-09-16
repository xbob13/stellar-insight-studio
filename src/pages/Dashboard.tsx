import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

type Row = {
  timestamp: string;
  kp_index: number;
  solar_wind_speed_kms: number;
};

type Summary = {
  file: string;
  rows: number;
  cols: number;
  time_range: { first: string; last: string };
  kp_index: { min: number; max: number; avg: number };
  solar_wind_speed_kms: { min: number; max: number; avg: number };
};

const API_BASE = ""; // relative to same origin on Render

export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dataRes, sumRes] = await Promise.all([
          fetch(`${API_BASE}/api/data?columns=timestamp,kp_index,solar_wind_speed_kms`),
          fetch(`${API_BASE}/api/summary`),
        ]);
        if (!dataRes.ok) throw new Error(`/api/data failed: ${dataRes.status}`);
        if (!sumRes.ok) throw new Error(`/api/summary failed: ${sumRes.status}`);
        const dataJson = await dataRes.json();
        const sumJson = await sumRes.json();

        // dataJson.head is an array of row objects
        setRows(dataJson.head as Row[]);
        setSummary(sumJson as Summary);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="p-6 text-lg">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Stellar Insight Dashboard</h1>

      {summary && (
        <div className="rounded-2xl shadow p-4 grid gap-2 bg-white/50 dark:bg-zinc-900">
          <div className="text-sm opacity-70">File</div>
          <div className="font-medium">{summary.file}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <Stat label="Rows" value={summary.rows} />
            <Stat label="Cols" value={summary.cols} />
            <Stat label="First" value={new Date(summary.time_range.first).toLocaleString()} />
            <Stat label="Last" value={new Date(summary.time_range.last).toLocaleString()} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MiniStat title="Kp Index" min={summary.kp_index.min} max={summary.kp_index.max} avg={summary.kp_index.avg} />
            <MiniStat title="Solar Wind Speed (km/s)" min={summary.solar_wind_speed_kms.min} max={summary.solar_wind_speed_kms.max} avg={summary.solar_wind_speed_kms.avg} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl shadow p-4 bg-white/50 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-2">Solar Wind Speed (km/s)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
              <YAxis />
              <Tooltip labelFormatter={(t) => new Date(String(t)).toLocaleString()} />
              <Line type="monotone" dataKey="solar_wind_speed_kms" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl shadow p-4 bg-white/50 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-2">Kp Index</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
              <YAxis />
              <Tooltip labelFormatter={(t) => new Date(String(t)).toLocaleString()} />
              <Bar dataKey="kp_index" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl shadow p-4 bg-white/50 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-3">Raw Rows</h2>
        <div className="overflow-auto text-sm">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2">Timestamp</th>
                <th className="p-2">Kp</th>
                <th className="p-2">Speed (km/s)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="odd:bg-black/5 dark:odd:bg-white/5">
                  <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="p-2">{r.kp_index}</td>
                  <td className="p-2">{r.solar_wind_speed_kms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function MiniStat({ title, min, max, avg }: { title: string; min: number; max: number; avg: number }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs mt-1 opacity-70">min / avg / max</div>
      <div className="text-lg font-semibold">{min} / {avg} / {max}</div>
    </div>
  );
}
