import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StudyHeroCardProps = {
  onGoToSetup: () => void;
};

export function StudyHeroCard({ onGoToSetup }: StudyHeroCardProps) {
  return (
    <Card className="relative rounded-3xl bg-[#FD6D3E]/15 max-w-2xl">
      <CardContent className="flex items-start flex-col gap-4 px-6 py-4">
        <div>
          <h2 className="text-4xl font-bold">Study time</h2>
        </div>

        <p className="max-w-md text-sm opacity-90">
          Small steps lead to big achievements.
        </p>
        <Button
          onClick={onGoToSetup}
          className="rounded-full bg-[#FD6D3E]/90 text-black hover:bg-[#FD6D3E]"
        >
          Start study session
        </Button>
      </CardContent>
      <div className="absolute right-20 bottom-0 hidden sm:block">
        <Image
          src="/illustrations/study-idle-illustration.svg"
          alt="Study illustration"
          width={70}
          height={70}
          priority
        />
      </div>
    </Card>
  );
}
