"use client";

import { useSession } from "@/hooks/useSession";
import { useAuthStore } from "@/stores/authStore";

export function SessionControls() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const { activeSession, isLoading, error, startSession, finishSession } =
    useSession();

  async function handleStart() {
    if (!userId) return;

    await startSession({
      timeGoal: 25,
      studyMode: "normal",
      tasks: [],
      features: {
        cameraEnabled: true,
        sensorsEnabled: true,
      },
    });
  }

  async function handleFinish() {
    await finishSession({
      tasks: activeSession?.tasks ?? [],
    });
  }

  return (
    <section className="rounded-xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Sessão de monitoramento</h2>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Iniciar Sessão
        </button>

        <button
          onClick={handleFinish}
          disabled={isLoading || !activeSession}
          className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Encerrar sessão
        </button>
      </div>

      {activeSession && (
        <p className="mt-3 text-sm text-gray-700">
          Sessão ativa: {activeSession._id}
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}
