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

const sessions = [
  {
    id: "1",
    date: "19/11/2025 às 14:00",
    duration: "2h 10 min",
    focus: "88%",
    temperature: "30 C",
    light: "800",
    noise: "800",
    tasks: "3/3",
    completed: true,
  },
  {
    id: "2",
    date: "19/11/2025 às 14:00",
    duration: "2h 10 min",
    focus: "88%",
    temperature: "30 C",
    light: "800",
    noise: "800",
    tasks: "1/2",
    completed: false,
  },
  {
    id: "3",
    date: "19/11/2025 às 14:00",
    duration: "2h 10 min",
    focus: "88%",
    temperature: "30 C",
    light: "800",
    noise: "800",
    tasks: "No tasks",
    completed: false,
  },
];

export function SessionHistoryTable() {
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
            {sessions.map((session) => (
              <TableRow
                key={session.id}
                className="border-b-2 border-b-[#F896A8]"
              >
                <TableCell className="text-center text-xs py-4">
                  {session.date}
                </TableCell>
                <TableCell className="text-center text-xs py-4">
                  {session.duration}
                </TableCell>
                <TableCell className="text-center text-xs py-4">
                  {session.focus}
                </TableCell>
                <TableCell className="flex justify-center text-xs py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Thermometer className="size-4" />
                      {session.temperature}
                    </span>

                    <span className="flex items-center gap-1">
                      <Lightbulb className="size-4" />
                      {session.light}
                    </span>

                    <span className="flex items-center gap-1">
                      <Volume2 className="size-4" />
                      {session.noise}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center text-xs py-4">
                  <div className="flex items-center gap-2">
                    {session.tasks}
                    {session.completed && (
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
