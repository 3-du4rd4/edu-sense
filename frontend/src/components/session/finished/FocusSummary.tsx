type FocusSummaryProps = {
  averageFocus: number;
};

export function FocusSummary({ averageFocus }: FocusSummaryProps) {
  return (
    <section className="px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Focus</h2>

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            during the session overall your focus was
          </p>

          <span className="text-[#76DF64] text-sm font-medium">
            {averageFocus}%
          </span>
        </div>
      </div>
    </section>
  );
}
