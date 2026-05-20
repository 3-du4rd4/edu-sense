"use client";

import { useSession } from "@/hooks/useSession";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

export function SessionControls() {
  const { activeSession, isLoading, error, startSession, finishSession } =
    useSession();

  async function handleStart() {
    await startSession({
      userId: TEST_USER_ID,
      timeGoal: 25,
      features: {
        cameraEnabled: true,
        sensorsEnabled: true,
      },
    });
  }

  return (
    <section className="rounded-xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Sessão de monitoramento</h2>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opcaity-50"
        >
          Iniciar Sessão
        </button>

        <button
          onClick={finishSession}
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
