import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold">Entrar</h2>
      {error && (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <form action={loginAction} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Não tem uma conta?{" "}
        <Link href="/no-account" className="text-brand-pink-light hover:underline">
          Saiba como entrar
        </Link>
      </p>
    </Card>
  );
}
