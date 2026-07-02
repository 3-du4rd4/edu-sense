import Image from "next/image";

export function SessionIllustrationStage() {
  return (
    <section className="flex flex-1 items-center justify-center py-10">
      <div className="flex min-h-[260px] w-full max-w-2xl items-center justify-center rounded-3xl">
        <Image
          src="/brand/edusense-footer.svg"
          alt="Active study session"
          width={260}
          height={200}
          className="opacity-50"
        />
      </div>
    </section>
  );
}
