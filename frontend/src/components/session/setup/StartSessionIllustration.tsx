import Image from "next/image";

export function StartSessionIllustration() {
  return (
    <section className="relative hidden w-full flex-col items-end xl:flex">
      <div className="relative w-full">
        <Image
          src="/illustrations/study-setup-illustration.svg"
          alt="Session setup illustration"
          width={0}
          height={0}
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
