export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 rounded-2xl border bg-white" />

        <div className="h-48 rounded-2xl border bg-white" />

        <div className="h-48 rounded-2xl border bg-white" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border bg-white" />

        <div className="h-80 rounded-2xl border bg-white" />
      </div>
    </div>
  );
}
