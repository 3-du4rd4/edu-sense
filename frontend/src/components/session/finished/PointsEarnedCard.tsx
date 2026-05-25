type PointsEarnedCardProps = {
  points: number;
  level: number;
};

export function PointsEarnedCard({ points, level }: PointsEarnedCardProps) {
  return (
    <section className="relative self-start rounded-xl px-6 py-4 bg-[#FDBC28]/15 text-center">
      <div className="absolute -right-4 -top-4 flex size-10 items-center justify-center rounded-full bg-yellow-400 text-lg font-bold text-white">
        {level}
      </div>

      <p className="text-sm font-semibold">Congratulations!</p>

      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="text-sm font-semibold">You won</p>
        <span className="text-xl font-bold text-[#F896A8]">+ {points} pts</span>
      </div>
    </section>
  );
}
