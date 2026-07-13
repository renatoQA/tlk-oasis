import Link from "next/link";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

const ROLE_TONE: Record<string, "purple" | "pink" | "green" | "yellow" | "red" | "muted"> = {
  ADMIN: "pink",
  COACH: "purple",
  PLAYER: "muted",
};

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  const users = await db.user.findMany({
    include: { team: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Usuários</h1>
      <Card>
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between py-3">
              <Link href={`/admin/users/${user.id}`} className="hover:text-brand-pink-light">
                <p className="font-medium">{user.name ?? "Sem nome"}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </Link>
              <div className="flex items-center gap-2">
                {user.team && <Badge tone="muted">{user.team.name}</Badge>}
                <Badge tone={ROLE_TONE[user.role]}>{user.role}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
