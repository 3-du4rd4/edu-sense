import Image from "next/image";

export function StartingIllustration() {
  return (
    <div className="flex justify-center">
      <Image
        src="/illustrations/study-setup-illustration.svg"
        alt="Starting study session"
        width={260}
        height={260}
        priority
      />
    </div>
  );
}
