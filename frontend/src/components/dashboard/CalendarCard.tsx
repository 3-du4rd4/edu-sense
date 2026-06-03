"use client";

import { isSameDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { useDashboardCalendar } from "@/hooks/useDashboardCalendar";

import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

function hasDate(date: Date, dates: Date[]) {
  return dates.some((item) => isSameDay(item, date));
}

export function CalendarCard() {
  const [monthDate, setMonthDate] = useState(new Date());

  const month = useMemo(() => formatMonth(monthDate), [monthDate]);

  const { data, isLoading, error } = useDashboardCalendar({
    userId: TEST_USER_ID,
    month,
  });

  const studiedDates = useMemo(
    () => (data?.studiedDates ?? []).map(parseDate),
    [data?.studiedDates],
  );

  const streakDates = useMemo(
    () => (data?.streakDates ?? []).map(parseDate),
    [data?.streakDates],
  );

  const today = new Date();

  return (
    <Card className="relative overflow-visible rounded-3xl ring-2 ring-[#76DF64]">
      <CardContent className="flex items-center justify-center p-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        )}

        {!isLoading && error && <p className="text-sm text-red-500">{error}</p>}

        {!isLoading && !error && (
          <>
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={() => {}}
              month={monthDate}
              onMonthChange={setMonthDate}
              showOutsideDays={true}
              modifiers={{
                studied: (date) =>
                  hasDate(date, studiedDates) && !hasDate(date, streakDates),
                streak: (date) =>
                  hasDate(date, streakDates) && !isSameDay(date, today),
                todayWithoutSession: (date) =>
                  isSameDay(date, today) && !hasDate(date, studiedDates),
                todayWithSession: (date) =>
                  isSameDay(date, today) && hasDate(date, studiedDates),
              }}
              modifiersClassNames={{
                day: "w-full h-9 p-0 font-normal cursor-default hover:bg-transparent focus:bg-transparent aria-selected:bg-transparent",
                studied:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-[#76DF64]",
                streak:
                  "relative before:absolute before:right-1 before:top-1 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#76DF64]",
                todayWithoutSession: "!rounded-full !border !border-[#76DF64]",
                todayWithSession:
                  "!rounded-full !bg-[#76DF64] !font-semibold hover:!bg-[#76DF64] hover:!text-white !text-white",
              }}
              className="w-80"
            />

            <div className="absolute -bottom-5 -right-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#76DF64] text-lg font-bold text-white shadow-md">
              {data?.currentStreak ?? 0} 🔥
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function formatMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`);
}
