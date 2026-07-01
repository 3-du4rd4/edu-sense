"use client";

import { useEnvironmentStore } from "@/stores/environmentStore";
import Image from "next/image";

const fallbackReading = {
  temperature: 30,
  light: 800,
  noise: 800,
};

export function EnvironmentStatusCard() {
  const latestReading = useEnvironmentStore((state) => state.latestReading);

  const reading = latestReading ?? fallbackReading;

  return (
    <section>
      <h2 className="text-xl font-semibold">Status do Ambiente</h2>

      <div className="ml-4">
        <p className="mt-1 text-sm text-muted-foreground">
          Antes de iniciar a sessão, verifique se o ambiente está adequado para
          o estudo
        </p>

        <div className="mt-5 flex items-center gap-12 flex-wrap">
          <div className="flex items-center gap-5">
            <Image
              src="/illustrations/study-idle-illustration-2.svg"
              alt="Study illustration"
              width={70}
              height={70}
            />

            <div className="space-y-2 text-sm">
              <EnvironmentMetric
                label="Temperatura ideal"
                // value={`${reading.temperature} °C`}
                // status="um pouco alta"
                value="20–24 °C"
                status="confortável"
                variant="success"
              />

              <EnvironmentMetric
                label="Iluminação recomendada"
                // value={`${reading.light} lx`}
                // status="perfeita"
                value="300–500 lx"
                status="adequada"
                variant="success"
              />

              <EnvironmentMetric
                // label="Ruído"
                // value={`${reading.noise} dB`}
                // status="muito alto"
                label="Ruído máximo"
                value="< 40 dB"
                status="silencioso"
                variant="warning"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="rounded-xl bg-[#FDBC28]/15 px-6 py-4 text-sm font-medium text-center">
              {/* Seu ambiente está quase perfeito! O ruído está um pouco alto. */}
              Um ambiente silencioso, iluminado e com temperatura estável
              melhora significativamente a concentração.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type EnvironmentMetricProps = {
  label: string;
  value: string;
  status: string;
  variant: "success" | "warning" | "danger";
};

function EnvironmentMetric({
  label,
  value,
  status,
  variant,
}: EnvironmentMetricProps) {
  const variantClass = {
    success: "bg-[#76DF64]",
    warning: "bg-[#FDBC28]",
    danger: "bg-[#FD6D3E]",
  }[variant];

  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <span className="font-medium text-sm">{label}:</span>

      <span className="text-sm">{value}</span>

      <span
        className={`rounded-full font-medium px-2 py-0.5 text-xs text-white text-center ${variantClass}`}
      >
        {status}
      </span>
    </div>
  );
}
