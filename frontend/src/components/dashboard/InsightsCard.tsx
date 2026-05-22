"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Lightbulb,
  MessageSquareHeart,
  SquareStar,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const insights = [
  {
    icon: Brain,
    title: "Best focus period",
    description:
      "You usually perform better during sessions started before 10 AM.",
  },
  {
    icon: Lightbulb,
    title: "Lighting pattern",
    description:
      "Your study environment tends to be brighter during your longer sessions.",
  },
  {
    icon: Star,
    title: "Consistency",
    description:
      "You completed 5 study days in a row. Keep your current rhythm.",
  },
];

const tips = [
  "Try to start your next session in a quiet environment.",
  "Keep your study area well lit to reduce visual fatigue.",
  "Use short breaks between longer focus blocks.",
];

export function InsightsCard() {
  return (
    <Card className="rounded-3xl ring-2 ring-[#FDBC28] bg-[#FDBC28]/15">
      <CardContent>
        <Tabs defaultValue="insights">
          <TabsList className="flex items-center gap-4 bg-transparent">
            <TabsTrigger value="insights" className="rounded-full">
              Insights
            </TabsTrigger>
            <TabsTrigger value="score" className="rounded-full">
              Score
            </TabsTrigger>
            <TabsTrigger value="tips" className="rounded-full">
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <InsightsCarousel />
          </TabsContent>

          <TabsContent value="score">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-center">
              <div className="flex size-28 items-center justify-center rounded-full bg-green-500 text-3xl font-bold text-white">
                82
              </div>

              <p className="mt-4 text-lg font-semibold">Great progress</p>

              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Your score combines study consistency, session completion and
                environmental quality.
              </p>

              <Badge className="mt-4 rounded-full">+12 points this week</Badge>
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <TipsCarousel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

type InsightItemProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function InsightItem({ icon: Icon, title, description }: InsightItemProps) {
  return (
    <div className="flex gap-3 rounded-2xl border p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5 text-green-600" />
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-3 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function InsightsCarousel() {
  const [current, setCurrent] = useState(0);
  const item = insights[current];

  useAutoSlide({
    setCurrent,
    total: insights.length,
  });

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex flex-col items-center justify-between">
        <SquareStar className="mb-4 self-end size-6 text-[#FDBC28]" />
        <p className="text-base font-semibold text-center">
          {item.description}
        </p>

        <CarouselDots
          total={insights.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function TipsCarousel() {
  const [current, setCurrent] = useState(0);
  const item = tips[current];

  useAutoSlide({
    setCurrent,
    total: tips.length,
  });

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex flex-col items-center justify-between">
        <MessageSquareHeart className="mb-4 self-end size-6 text-[#FDBC28]" />
        <p className="text-base font-semibold text-center">{item}</p>

        <CarouselDots
          total={tips.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function CarouselDots({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="mt-5 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={cn(
            "h-2 rounded-full transition-all",
            current === index
              ? "w-6 bg-[#FDBC28]"
              : "w-2 bg-muted-foreground/30",
          )}
          aria-label={`Go to item ${index + 1}`}
        />
      ))}
    </div>
  );
}

function useAutoSlide({
  setCurrent,
  total,
}: {
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}) {
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [setCurrent, total]);
}
