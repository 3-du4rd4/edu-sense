import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { greetingData } from "@/mocks/dashboard";
import { useAuthStore } from "@/stores/authStore";

export function GreetingCard() {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="relative rounded-3xl bg-[#FDBC28]/15">
      <CardContent className="flex flex-col gap-4 px-6 py-4">
        <div>
          <h2 className="text-4xl font-bold">
            {greetingData.greeting} {user?.name.split(" ")[0]}!
          </h2>
        </div>

        <p className="max-w-md text-sm opacity-90">É bom te ver!</p>
      </CardContent>
      <div className="absolute right-20 bottom-0 hidden md:block">
        <Image
          src={greetingData.illustration}
          alt="Study illustration"
          width={70}
          height={70}
          priority
        />
      </div>
    </Card>
  );
}
