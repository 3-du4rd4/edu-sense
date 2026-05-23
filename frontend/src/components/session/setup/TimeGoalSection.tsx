"use client";

import { Goal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const presets = [
  { label: "25 minutes", value: "25", minutes: 25 },
  { label: "30 minutes", value: "30", minutes: 30 },
  { label: "50 minutes", value: "50", minutes: 50 },
  { label: "1 hour", value: "60", minutes: 60 },
  { label: "2 hours", value: "120", minutes: 120 },
  { label: "Custom", value: "custom", minutes: null },
];

type TimeGoalSectionProps = {
  timeGoalMinutes: number | null;
  onChange: (timeGoalMinutes: number | null) => void;
};

export function TimeGoalSection({
  timeGoalMinutes,
  onChange,
}: TimeGoalSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string>("none");
  const [customHours, setCustomHours] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");

  const isCustom = selectedOption === "custom";

  function handleSelectChange(value: string) {
    setSelectedOption(value);

    if (value === "custom") {
      onChange(null);
      return;
    }

    setCustomHours("");
    setCustomMinutes("");
    onChange(Number(value));
  }

  function handleCustomValue(hours: string, minutes: string) {
    setCustomHours(hours);
    setCustomMinutes(minutes);

    const parsedHours = Number(hours || 0);
    const parsedMinutes = Number(minutes || 0);

    const totalMinutes = parsedHours * 60 + parsedMinutes;

    if (totalMinutes <= 0) {
      onChange(null);
      return;
    }

    onChange(totalMinutes);
  }

  function clearTimeGoal() {
    setSelectedOption("none");
    setCustomHours("");
    setCustomMinutes("");
    onChange(null);
  }

  return (
    <section className="px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Time goal</h2>

        <p className="text-sm text-muted-foreground font-medium">
          you can define a time goal for your study session
        </p>

        <Select value={selectedOption} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-fit gap-2 rounded-full border-none bg-[#76DF64] px-4 py-2 text-xs font-medium focus:ring-0 focus:ring-offset-0 [&>svg]:text-current">
            <Goal className="size-4" />
            <SelectValue placeholder="No time goal selected">
              {timeGoalMinutes
                ? formatTimeGoal(timeGoalMinutes)
                : "No time goal selected"}
            </SelectValue>

            {timeGoalMinutes && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={clearTimeGoal}
                className="size-4 rounded-full hover:bg-transparent"
              >
                <X className="size-4" />
              </Button>
            )}
          </SelectTrigger>

          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.value} value={String(preset.value)}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isCustom && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={customHours}
              onChange={(event) =>
                handleCustomValue(event.target.value, customMinutes)
              }
              placeholder="0"
              className="h-8 w-16 rounded-full text-sm"
            />

            <span className="text-xs text-muted-foreground">h</span>

            <Input
              type="number"
              min={0}
              autoFocus
              value={customMinutes}
              onChange={(event) =>
                handleCustomValue(customHours, event.target.value)
              }
              placeholder="0"
              className="h-8 w-16 rounded-full text-sm"
            />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
        )}
      </div>
    </section>
  );
}

function formatTimeGoal(minutes: number) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}
