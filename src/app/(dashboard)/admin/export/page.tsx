import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { ExportForm } from "@/components/admin/export-form";

export default async function AdminExportPage() {
  await requireRole("ADMIN");

  const teams = await db.team.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">Exportar dados</h1>
      <Card>
        <ExportForm teams={teams} />
      </Card>
    </div>
  );
}
