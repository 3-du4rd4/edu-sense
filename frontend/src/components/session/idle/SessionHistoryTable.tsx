import {
  CheckCircle2,
  Thermometer,
  Lightbulb,
  Volume2,
  TextSearch,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonitoringSession } from "@/types/session";

type SessionHistoryTableProps = {
  sessions: MonitoringSession[];
  isLoading: boolean;
  error: string | null;
};

export function SessionHistoryTable({
  sessions,
  isLoading,
  error,
}: SessionHistoryTableProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Session historic</h2>

        <button className="text-xs text-muted-foreground underline-offset-4 hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-hidden rounded-t-md">
        <Table>
          <TableHeader className="bg-[#F896A8]">
            <TableRow className=" hover:bg-[#F896A8]">
              <TableHead className="text-center text-xs font-semibold">
                Date
              </TableHead>
              <TableHead className="text-center text-xs font-semibold">
                Duration
              </TableHead>
              <TableHead className="text-center text-xs font-semibold">
                Focus
              </TableHead>
              <TableHead className="text-center text-xs font-semibold">
                Environment
              </TableHead>
              <TableHead className="text-xs font-semibold">Tasks</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody className="border-b-2 border-b-[#F896A8]">
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-4 text-center text-xs">
                  Loading sessions...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-4 text-center text-xs text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && sessions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-4 text-center text-xs text-muted-foreground"
                >
                  No sessions found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !error &&
              sessions.map((session) => (
                <TableRow
                  key={session._id}
                  className="border-b-2 border-b-[#F896A8]"
                >
                  <TableCell className="text-center text-xs py-4">
                    {formatDate(session.startTime)}
                  </TableCell>
                  <TableCell className="text-center text-xs py-4">
                    {formatDuration(session.durationSeconds ?? 0)}
                  </TableCell>
                  <TableCell className="text-center text-xs py-4">
                    {session.summary.focus !== null &&
                    session.summary.focus !== undefined
                      ? `${session.summary.focus}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="flex justify-center text-xs py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Thermometer className="size-4" />
                        {formatMetric(session.summary.temperature, "°C")}
                      </span>

                      <span className="flex items-center gap-1">
                        <Lightbulb className="size-4" />
                        {formatMetric(session.summary.light, "lx")}
                      </span>

                      <span className="flex items-center gap-1">
                        <Volume2 className="size-4" />
                        {formatMetric(session.summary.noise, "dB")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-xs py-4">
                    <div className="flex items-center gap-2">
                      {formatTasks(session)}
                      {areAllTasksCompleted(session) && (
                        <CheckCircle2 className="size-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <TextSearch className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(date))
    .replace(", ", " às ");
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.round(durationSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

function formatMetric(value: number | null | undefined, suffix: string) {
  if (value === null || value === undefined) return "N/A";

  return `${value} ${suffix}`;
}

function formatTasks(session: MonitoringSession) {
  if (!session.tasks.length) return "No tasks";

  const completed = session.tasks.filter((task) => task.completed).length;

  return `${completed}/${session.tasks.length}`;
}

function areAllTasksCompleted(session: MonitoringSession) {
  return (
    session.tasks.length > 0 && session.tasks.every((task) => task.completed)
  );
}
