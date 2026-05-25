import Image from "next/image";

export function FinishedHero() {
  return (
    <div className="hidden justify-center xl:flex">
      <Image
        src="/illustrations/study-finished-illustration.svg"
        alt="Session finished"
        width={360}
        height={260}
      />
    </div>
  );
}
