"use client";

import { useEnvironmentStore } from "@/stores/environmentStore";

export function ReadingsList() {
  const readings = useEnvironmentStore((state) => state.readings);

  return (
    <section className="rounded-xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Últimas leituras</h2>

      {readings.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma leitura registrada.</p>
      ) : (
        <div className="space-y-2">
          {readings.map((reading) => (
            <div key={reading._id} className="rounded-lg border p-3 text-sm">
              <p>Temperatura: {reading.temperature}°C</p>
              <p>Ruído: {reading.noise}</p>
              <p>Luz: {reading.light}</p>
              <p className="text-gray-500">
                {new Date(reading.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
