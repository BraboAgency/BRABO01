export type TimelineItem = {
  status: string;
  time: string;
  notes?: string;
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.status}-${item.time}`} className="flex gap-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.status}</p>
            <p className="text-xs text-slate-500">{item.time}</p>
            {item.notes && <p className="text-sm text-slate-600">{item.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
