"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, LockKeyhole, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function SignupForm() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Senhas não coincidem.");
      return;
    }

    setFormError(null);

    await signup({
      name,
      email,
      password,
    });

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-4xl font-semibold">Comece Agora</h1>
      </div>

      <div className="space-y-5">
        <Field label="Nome completo">
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={name}
              placeholder="Insira seu nome completo"
              onChange={(event) => setName(event.target.value)}
              className="rounded-md pl-10 text-sm"
              required
            />
          </div>
        </Field>

        <Field label="Email">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="email"
              placeholder="Insira seu email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md pl-10 text-sm"
              required
            />
          </div>
        </Field>

        <Field label="Senha">
          <PasswordInput
            value={password}
            onChange={setPassword}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((current) => !current)}
          />
        </Field>

        <Field label="Confirmar senha">
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggleShowPassword={() =>
              setShowConfirmPassword((current) => !current)
            }
          />
        </Field>

        {(formError || error) && (
          <p className="text-sm text-red-500">{formError ?? error}</p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full bg-[#45C4F9] text-black hover:bg-[#38b7ec]"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </div>

      <div className="h-px bg-border" />

      <p className="text-xs">
        <span className="text-muted-foreground">Já tem uma conta? </span>
        <Link href="/signin" className="font-semibold hover:underline ml-1">
          Entrar
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function PasswordInput({
  value,
  onChange,
  showPassword,
  onToggleShowPassword,
}: {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}) {
  return (
    <div className="relative">
      <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md px-10 text-sm"
        minLength={8}
        maxLength={72}
        required
      />

      <button
        type="button"
        onClick={onToggleShowPassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <Eye className="size-4" />
      </button>
    </div>
  );
}
