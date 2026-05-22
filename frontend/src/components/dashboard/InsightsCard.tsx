"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { insightItems, studyTips } from "@/mocks/dashboard";

import { MessageSquareHeart, SquareStar } from "lucide-react";

import { CarouselDots } from "./CarouselDots";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <ScoreContent />
          </TabsContent>

          <TabsContent value="tips">
            <TipsCarousel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InsightsCarousel() {
  const [current, setCurrent] = useState(0);
  const item = insightItems[current];

  useAutoSlide({
    setCurrent,
    total: insightItems.length,
  });

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex flex-col items-center justify-between">
        <SquareStar className="mb-4 self-end size-6 text-[#FDBC28]" />
        <p className="text-base font-semibold text-center">{item.text}</p>

        <CarouselDots
          total={insightItems.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function TipsCarousel() {
  const [current, setCurrent] = useState(0);
  const item = studyTips[current];

  useAutoSlide({
    setCurrent,
    total: studyTips.length,
  });

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="flex flex-col items-center justify-between">
        <MessageSquareHeart className="mb-4 self-end size-6 text-[#FDBC28]" />
        <p className="text-base font-semibold text-center">{item.text}</p>

        <CarouselDots
          total={studyTips.length}
          current={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function ScoreContent() {
  return (
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
