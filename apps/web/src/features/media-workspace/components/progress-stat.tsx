export function ProgressStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-xs">
        <span className="text-[var(--vextro-muted)]">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/8">
        <div className="h-full bg-amber-200" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
