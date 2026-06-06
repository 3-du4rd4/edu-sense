import { SignupForm } from "@/components/auth/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex items-center justify-center p-8">
        <SignupForm />
      </section>

      <section className="hidden items-center justify-center lg:flex">
        <div className="relative h-[620px] w-[420px] rounded-3xl bg-[#FFBE2F]">
          <div className="absolute right-8 top-8 flex size-9 items-center justify-center rounded-full bg-white">
            <Image
              src="/brand/edusense-icon.svg"
              alt="Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </div>

          <div className="absolute left-1/2 top-1/2 h-[420px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#76DF64]" />
        </div>
      </section>
    </div>
  );
}
