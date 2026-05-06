export function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border border-white/12 bg-white/7 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="text-xs text-white/50">{detail}</p>
    </div>
  );
}
