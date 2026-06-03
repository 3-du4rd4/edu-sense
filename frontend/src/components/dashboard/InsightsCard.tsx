"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { insightItems, studyTips } from "@/mocks/dashboard";

import { MessageSquareHeart, SquareStar } from "lucide-react";

import { CarouselDots } from "./CarouselDots";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardData } from "@/types/dashboard";

type InsightsCardProps = {
  insights: DashboardData["insights"];
  tips: DashboardData["tips"];
  score: DashboardData["score"];
};

export function InsightsCard({ insights, tips, score }: InsightsCardProps) {
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
            <InsightsCarousel insights={insights} />
          </TabsContent>

          <TabsContent value="score">
            <ScoreContent score={score} />
          </TabsContent>

          <TabsContent value="tips">
            <TipsCarousel tips={tips} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InsightsCarousel({
  insights,
}: {
  insights: DashboardData["insights"];
}) {
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

function TipsCarousel({ tips }: { tips: DashboardData["tips"] }) {
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
        <p className="text-base font-semibold text-center">
          {item.description}
        </p>

        <CarouselDots
          total={tips.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

type TextCarouselItem = {
  description: string;
};

function TextCarousel({
  items,
  emptyMessage,
}: {
  items: TextCarouselItem[];
  emptyMessage: string;
}) {
  const [current, setCurrent] = useState(0);

  useAutoSlide({
    setCurrent,
    total: items.length,
  });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 text-sm text-muted-foreground shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  const item = items[current];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex min-h-36 flex-col justify-between">
        <div>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>

        <CarouselDots
          total={items.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function ScoreContent({ score }: { score: DashboardData["score"] }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#76DF64] text-2xl font-semibold text-white">
        {score.level}
      </div>

      <p className="mt-4 text-lg font-semibold">
        {score.totalPoints} total points
      </p>

      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Keep studying to increase your level and unlock more progress.
      </p>

      <Badge className="mt-4 rounded-full">
        {score.pointsToNextLevel > 0
          ? `${score.pointsToNextLevel} pts to next level`
          : "New level reached"}
      </Badge>
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
