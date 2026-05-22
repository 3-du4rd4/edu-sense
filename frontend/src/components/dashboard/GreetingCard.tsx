import Image from "next/image";
import { Card, CardContent } from "../ui/card";

export function GreetingCard() {
  return (
    <Card className="relative rounded-3xl bg-[#FDBC28]/15">
      <CardContent className="flex flex-col gap-4 px-6 py-4">
        <div>
          <h2 className="text-4xl font-bold">Hello Maria!</h2>
        </div>

        <p className="max-w-md text-sm opacity-90">It's good to see you.</p>
      </CardContent>
      <div className="absolute right-20 bottom-0 hidden md:block">
        <Image
          src="/illustrations/dashboard-illustration.svg"
          alt="Study illustration"
          width={70}
          height={70}
          priority
        />
      </div>
    </Card>
  );
}
