import { cn } from "@/lib/utils";

export function Segment({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs uppercase tracking-[0.16em] text-(--vextro-muted)">
        {label}
      </p>
      <div className="flex min-w-0 gap-1 overflow-x-auto border border-(--vextro-line) bg-black/20 p-1">
        {options.map((option) => (
          <button
            className={cn(
              "min-h-8 min-w-max flex-1 whitespace-nowrap px-3 text-center text-xs font-medium leading-tight transition",
              option === value
                ? "bg-white text-zinc-950"
                : "text-(--vextro-soft) hover:bg-white/8",
            )}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
