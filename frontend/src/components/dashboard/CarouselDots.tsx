"use client";

import { cn } from "@/lib/utils";

type CarouselDotsProps = {
  total: number;
  current: number;
  onChange: (index: number) => void;
};

export function CarouselDots({ total, current, onChange }: CarouselDotsProps) {
  return (
    <div className="mt-5 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index)}
          className={cn(
            "h-2 rounded-full transition-all",
            current === index
              ? "w-6 bg-[#FDBC28]"
              : "w-2 bg-muted-foreground/30",
          )}
          aria-label={`Go to item ${index + 1}`}
        />
      ))}
    </div>
  );
}
