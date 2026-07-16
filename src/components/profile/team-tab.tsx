import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Avatar, TeamLogo } from "@/components/ui/avatar";

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
      <div className="mb-4 flex items-center gap-3">
        <TeamLogo src={user.team.logoUrl} name={user.team.name} size="lg" />
        <h3 className="text-base font-semibold">{user.team.name}</h3>
        <Badge tone="purple">{user.team.members.length} jogadores</Badge>
      </div>
      <ul className="space-y-1.5 text-sm">
        {user.team.members.map((member) => (
          <li key={member.id} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Avatar src={member.photoUrl} name={member.name ?? member.email} size="sm" />
              {member.name ?? member.email}
            </span>
            <div className="flex gap-1.5">
              {member.isCaptain && <Badge tone="pink">Capitão</Badge>}
              {member.isIgl && <Badge tone="purple">IGL</Badge>}
              {member.id === userId && <Badge tone="muted">você</Badge>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
