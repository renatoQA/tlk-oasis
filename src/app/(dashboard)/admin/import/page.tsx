import { requireRole } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { RosterImportForm } from "@/components/admin/roster-import-form";

export default async function AdminImportPage() {
  await requireRole("ADMIN");

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-xl font-semibold">Importar planilha</h1>
      <p className="mb-6 text-sm text-muted">
        Cola aqui o CSV da planilha. A importação só <strong>atualiza contas que já existem</strong> —
        o nome da linha precisa bater exatamente com o nome cadastrado do usuário. Cabeçalhos
        aceitos: <code>Nome</code> (chave de busca), <code>Time</code> (TLK Karma/TLK Alfa/TLK Omega),{" "}
        <code>Nick</code>, <code>Instagram</code>, <code>Endereço</code>, <code>Data de Nascimento</code>{" "}
        (DD/MM/AAAA), <code>Tamanho Camiseta</code>.
      </p>
      <Card>
        <RosterImportForm />
      </Card>
    </div>
  );
}
