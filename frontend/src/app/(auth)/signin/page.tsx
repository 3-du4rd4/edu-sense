import { SigninForm } from "@/components/auth/SigninForm";
import Image from "next/image";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="hidden items-center justify-center lg:flex">
        <div className="relative h-[620px] w-[420px] rounded-3xl bg-[#F896A8]">
          <div className="absolute left-8 top-8 flex size-9 items-center justify-center rounded-full bg-white">
            <Image
              src="/brand/edusense-icon.svg"
              alt="Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </div>

          <div className="absolute left-1/2 top-1/2 h-[420px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#FF6644]" />
        </div>
      </section>

      <section className="relative flex items-center justify-center p-8">
        <div className="absolute right-8 top-8 text-xs">
          <span className="text-muted-foreground">
            Do not have an account?{" "}
          </span>

          <Link href="/signup" className="font-semibold hover:underline ml-1">
            Sign up
          </Link>
        </div>

        <SigninForm />
      </section>
    </div>
  );
}
