"use client";

import { CheckCircle2, Lightbulb, Thermometer, Volume2 } from "lucide-react";

import { MonitoringSession } from "@/types/session";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SessionDetailsDialogProps = {
  session: MonitoringSession;
  children: React.ReactNode;
};

export function SessionDetailsDialog({
  session,
  children,
}: SessionDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-3xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da sessão</DialogTitle>
          <DialogDescription>
            Sessão iniciada em {formatDate(session.startTime)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="grid gap-3 sm:grid-cols-3">
            <DetailCard
              label="Duração"
              value={formatDuration(session.durationSeconds ?? 0)}
            />
            <DetailCard
              label="Foco"
              value={formatMetric(session.summary.focus, "%")}
            />
            <DetailCard
              label="Pontos"
              value={`+${session.points.earned} pts`}
            />
          </div>

          <section>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">
              Médias do ambiente
            </h3>

            <div className="mt-3 flex flex-wrap gap-3">
              <Metric
                icon={Thermometer}
                value={formatMetric(session.summary.temperature, "°C")}
              />
              <Metric
                icon={Lightbulb}
                value={formatMetric(session.summary.light, "lx")}
              />
              <Metric
                icon={Volume2}
                value={formatMetric(session.summary.noise, "dB")}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">
              Tarefas
            </h3>

            <div className="mt-3 space-y-2">
              {session.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma tarefa adicionada.
                </p>
              ) : (
                session.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm"
                  >
                    <span
                      className={cn(!task.completed && "text-muted-foreground")}
                    >
                      {task.title}
                    </span>

                    {task.completed && (
                      <CheckCircle2 className="size-4 text-green-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">
              Distribuição de pontos
            </h3>

            <div className="mt-3 overflow-hidden rounded-lg border">
              <div className="divide-y">
                <BreakdownRow
                  label="Sessão concluída"
                  value={session.points.breakdown.sessionCompleted}
                />

                <BreakdownRow
                  label="Meta de tempo alcançada"
                  value={session.points.breakdown.timeGoalAchieved}
                />

                <BreakdownRow
                  label="Tarefas concluídas"
                  value={session.points.breakdown.completedTasks}
                />

                <BreakdownRow
                  label="Bônus de foco"
                  value={session.points.breakdown.focusBonus}
                  highlight={session.points.breakdown.focusBonus > 0}
                />

                <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
                  <span className="font-semibold">Total</span>

                  <span className="font-bold">
                    +{session.points.earned} pts
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted px-4 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
      <Icon className="size-4" />
      <span className="font-medium">{value}</span>
    </div>
  );
}

type BreakdownRowProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

function BreakdownRow({ label, value, highlight = false }: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className={cn("font-medium", highlight && "text-[#76DF64]")}>
        +{value}
      </span>
    </div>
  );
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.round(durationSeconds / 60);

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}min`;
}

function formatMetric(value: number | null | undefined, suffix: string) {
  if (value === null || value === undefined) return "N/A";

  if (suffix === "%") return `${value}%`;

  return `${value} ${suffix}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
