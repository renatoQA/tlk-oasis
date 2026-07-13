import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";

export async function TeamTab({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { team: { include: { members: true } } },
  });

  if (!user?.team) {
    return (
      <Card>
        <h3 className="text-base font-semibold">Time</h3>
        <p className="mt-2 text-sm text-muted">Ainda não vinculado a nenhum time.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-base font-semibold">{user.team.name}</h3>
        <Badge tone="purple">{user.team.members.length} jogadores</Badge>
      </div>
      <ul className="space-y-1.5 text-sm">
        {user.team.members.map((member) => (
          <li key={member.id} className="flex items-center justify-between">
            <span>{member.name ?? member.email}</span>
            {member.id === userId && <Badge tone="pink">você</Badge>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
