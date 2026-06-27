import { SetupTask } from "../types";

type CompletedTasksSummaryProps = {
  tasks: SetupTask[];
};

export function CompletedTasksSummary({ tasks }: CompletedTasksSummaryProps) {
  const completedTasks = tasks.filter((task) => task.completed);
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Tarefas</h2>

        <div className="h-1.5 w-40 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#45C8FF]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 items-start px-4">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <span
                className={`size-3 rounded-full ${
                  task.completed ? "bg-[#F896A8]" : "bg-muted"
                }`}
              />

              <span className="text-sm font-medium">{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
