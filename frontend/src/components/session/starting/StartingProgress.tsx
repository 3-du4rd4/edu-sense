"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";

const steps = [
  "Preparing your study space",
  "Checking monitoring settings",
  "Starting focus environment",
  "Almost ready",
];

export function StartingProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  const progress = useMemo(() => {
    return ((currentStep + 1) / steps.length) * 100;
  }, [currentStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((current) => {
        if (current >= steps.length - 1) return current;
        return current + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xs space-y-5">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />

        <p className="text-center text-xs text-muted-foreground">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}
