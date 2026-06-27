"use client";

import { ListTodo } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SetupTask } from "../types";
import { cn } from "@/lib/utils";

type TasksPopoverProps = {
  tasks: SetupTask[];
  onToggleTask: (taskId: string) => void;
};

export function TasksPopover({ tasks, onToggleTask }: TasksPopoverProps) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const allTasksCompleted = completedTasks === tasks.length && tasks.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center text-muted-foreground gap-2 rounded-full px-2 py-1 text-xs transition hover:bg-muted-foreground/10">
          <ListTodo
            className={cn("size-4", allTasksCompleted && "text-[#76DF64]")}
          />
          <span className="font-medium tabular-nums">
            {completedTasks}/{tasks.length}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="max-w-sm p-3">
        <div>
          <h3 className="text-sm font-semibold">Tarefas da sessão</h3>
          <p className="text-xs text-muted-foreground">
            Marque as tarefas conforme você as completa
          </p>
        </div>

        <div className="mt-2 space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              nenhuma tarefa para esta sessão
            </p>
          ) : (
            tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-center gap-3 p-2"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id)}
                />

                <span className="text-xs font-medium">{task.title}</span>
              </label>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
