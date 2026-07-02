"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function SigninForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await login({
      email,
      password,
    });

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Entrar</h1>
      </div>

      <div className="space-y-5">
        {/* <div>
          <p className="mb-3 text-sm font-medium">Sign in with Open account</p>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" disabled>
              Google
            </Button>

            <Button type="button" variant="outline" disabled>
              Apple ID
            </Button>
          </div>
        </div>

        <div className="h-px bg-border" /> */}

        <div>
          {/* <p className="mb-3 text-sm font-medium">
            Or continue with email address
          </p> */}

          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="email"
                value={email}
                placeholder="Insira seu email"
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-md pl-10 text-sm"
                required
              />
            </div>

            <div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Insira sua senha"
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-md px-10 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Eye className="size-4" />
                </button>
              </div>

              <button
                type="button"
                className="mt-2 block ml-auto text-xs text-muted-foreground"
                disabled
              >
                Esqueceu a senha?
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-[#45C4F9] text-black hover:bg-[#38b7ec]"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Começar a estudar"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
