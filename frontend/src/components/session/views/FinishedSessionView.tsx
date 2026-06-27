import Image from "next/image";

import { Button } from "@/components/ui/button";

import { SessionResultData, SessionSetupData } from "../types";

import { FinishedHero } from "../finished/FinishedHero";
import { FocusSummary } from "../finished/FocusSummary";
import { DurationSection } from "../finished/DurationSection";
import { PointsEarnedCard } from "../finished/PointsEarnedCard";
import { MonitoringSummary } from "../finished/MonitoringSummary";
import { CompletedTasksSummary } from "../finished/CompletedTasksSummary";

type FinishedSessionViewProps = {
  onContinue: () => void;
  setupData: SessionSetupData;
  resultData: SessionResultData | null;
};

export function FinishedSessionView({
  onContinue,
  setupData,
  resultData,
}: FinishedSessionViewProps) {
  if (!resultData) {
    return (
      <div className="rounded-3xl border bg-card p-6">
        Resultado da sessão indisponível.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Muito bem!</h1>
        <p className="mt-2 max-w-2xl text-base font-medium text-muted-foreground">
          Sua sessão de estudo foi concluída com sucesso. Aqui está um resumo do
          que você fez.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <CompletedTasksSummary tasks={setupData.tasks} />

          <DurationSection
            timeGoalMinutes={setupData.timeGoalMinutes}
            durationMinutes={resultData.durationMinutes}
          />

          {resultData.focusAverage !== null && (
            <FocusSummary averageFocus={resultData.focusAverage} />
          )}

          <MonitoringSummary
            averageTemperature={resultData.temperatureAverage}
            averageLight={resultData.lightAverage}
            averageNoise={resultData.noiseAverage}
          />
        </div>

        <FinishedHero />
      </div>

      <section className="flex items-end gap-10 justify-end">
        <div className="flex gap-3">
          <Image
            src="/illustrations/study-idle-illustration.svg"
            alt="EduSense mascot"
            width={40}
            height={40}
            className="self-end mt-10"
          />

          <PointsEarnedCard
            points={resultData.pointsEarned}
            level={resultData.level}
          />
        </div>

        <Button
          onClick={onContinue}
          className="rounded-full bg-[#FD6D3E] text-foreground font-semibold px-4"
        >
          Continuar
        </Button>
      </section>
    </div>
  );
}
