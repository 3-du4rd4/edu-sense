import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RedirectIfAuthenticated>
      <main className="min-h-screen bg-background">{children}</main>
    </RedirectIfAuthenticated>
  );
}
