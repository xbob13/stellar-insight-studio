import { Routes, Route, Link, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex items-center gap-4">
        <h1 className="text-xl font-semibold">Stellar Insight Studio</h1>
        <nav className="flex gap-3 text-sm">
          <Link className="underline" to="/">Home</Link>
          <Link className="underline" to="/dashboard">Dashboard</Link>
          <a className="underline" href="/healthz" target="_blank" rel="noreferrer">/healthz</a>
          <a className="underline" href="/api/data" target="_blank" rel="noreferrer">/api/data</a>
          <a className="underline" href="/api/summary" target="_blank" rel="noreferrer">/api/summary</a>
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Optional alias */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
