import { BookOpen, Brain, Coffee } from "lucide-react";

import { cn } from "@/lib/utils";

import { StudyMode } from "../types";

const modes = [
  {
    value: "normal",
    label: "Normal",
    description: "Balanced monitoring for regular study.",
    icon: BookOpen,
  },
  {
    value: "focus",
    label: "Focus",
    description: "More attention to focus and distractions.",
    icon: Brain,
  },
  {
    value: "reading",
    label: "Reading",
    description: "Gentler tracking for reading sessions.",
    icon: Coffee,
  },
] satisfies {
  value: StudyMode;
  label: string;
  description: string;
  icon: React.ElementType;
}[];

type StudyModeSectionProps = {
  value: StudyMode;
  onChange: (value: StudyMode) => void;
};

export function StudyModeSection({ value, onChange }: StudyModeSectionProps) {
  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Study mode</h2>
        <p className="text-sm text-muted-foreground font-medium">
          select the mode that best suits your situation
        </p>
      </div>

      <div className="grid gap-3 grid-cols-3 px-4">
        {modes.map((mode) => {
          const selected = value === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={cn(
                "rounded-full py-1 px-6 text-center transition text-white",
                selected
                  ? "bg-[#45C8FF]"
                  : "bg-[#45C8FF]/50 hover:bg-[#45C8FF]/70",
              )}
            >
              <p className="text-sm font-semibold">{mode.label}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
