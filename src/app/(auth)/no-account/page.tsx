import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NoAccountPage() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">Cadastro somente por convite</h2>
      <p className="text-sm text-muted">
        O acesso à plataforma da TLK é feito por convite. Peça para o seu coach ou
        para o admin da organização criar um convite com o seu email — você vai
        receber um link para finalizar o cadastro.
      </p>
      <Link href="/login" className="mt-6 block">
        <Button variant="secondary" className="w-full">
          Voltar para o login
        </Button>
      </Link>
    </Card>
  );
}
