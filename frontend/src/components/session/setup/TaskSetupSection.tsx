"use client";

import { useState } from "react";
import { Check, Minus, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SetupTask } from "../types";

type TaskSetupSectionProps = {
  tasks: SetupTask[];
  onAddTask: (title: string) => void;
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
};

export function TaskSetupSection({
  tasks,
  onAddTask,
  onRemoveTask,
  onEditTask,
}: TaskSetupSectionProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  function handleAddTask() {
    const trimmedTitle = newTaskTitle.trim();

    if (!trimmedTitle) return;

    onAddTask(trimmedTitle);
    setIsAdding(false);
    setNewTaskTitle("");
  }

  function startEditing(task: SetupTask) {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  }

  function saveEditing(taskId: string) {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) return;

    onEditTask(taskId, trimmedTitle);
    setEditingTaskId(null);
    setEditingTitle("");
  }

  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Tarefas</h2>
        <p className="text-sm text-muted-foreground font-medium">
          se você já sabe o que deseja fazer hoje, pode acompanhar suas tarefas
          aqui
        </p>
      </div>

      <div className="flex flex-col gap-3 items-start px-4">
        <div className="space-y-3">
          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
              <div key={task.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#F896A8]" />

                {isEditing ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveEditing(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEditing(task.id);
                      }
                    }}
                    className="rounded-full text-sm h-7"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium">{task.title}</span>
                )}

                {isEditing ? (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="rounded-full"
                    onClick={() => saveEditing(task.id)}
                  >
                    <Check className="text-green-500" strokeWidth={4} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="rounded-full"
                    onClick={() => startEditing(task)}
                  >
                    <Pencil className="text-muted-foreground" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="xs"
                  className="rounded-full"
                  onClick={() => onRemoveTask(task.id)}
                >
                  <Minus className="text-[#F896A8]" strokeWidth={5} />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex w-full max-w-md items-center gap-2">
          {isAdding ? (
            <>
              <Input
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddTask();
                  }
                }}
                placeholder="nova tarefa..."
                className="rounded-full text-sm h-7"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/15"
              >
                <Plus className="mr-1" />
                adicionar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskTitle("");
                }}
                className="rounded-full text-red-500 text-xs hover:text-red-500"
              >
                cancelar
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-muted-foreground bg-muted hover:bg-muted-foreground/15"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-1" />
              clique para adicionar uma tarefa
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
