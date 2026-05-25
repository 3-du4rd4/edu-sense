"use client";

type SessionTimerBadgeProps = {
  elapsedSeconds: number;
};

export function SessionTimerBadge({ elapsedSeconds }: SessionTimerBadgeProps) {
  return (
    <div className="rounded-full bg-[#F896A8] px-4 py-1 text-sm font-graduate">
      {formatTime(elapsedSeconds)}
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
