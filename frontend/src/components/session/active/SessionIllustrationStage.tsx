import Image from "next/image";

export function SessionIllustrationStage() {
  return (
    <section className="flex flex-1 items-center justify-center py-16">
      <div className="flex min-h-[260px] w-full max-w-2xl items-center justify-center rounded-3xl bg-orange-500">
        <Image
          src="/illustrations/active-session.svg"
          alt="Active study session"
          width={360}
          height={240}
          className="hidden"
        />
      </div>
    </section>
  );
}
