export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
      {label}
    </span>
  );
}
