import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/enums";

type SessionUser = { id: string; role: Role; teamId: string | null };

export async function coachTeamIds(userId: string): Promise<string[]> {
  const assignments = await db.coachAssignment.findMany({
    where: { userId },
    select: { teamId: true },
  });
  return assignments.map((a) => a.teamId);
}

export async function canManageTeam(user: SessionUser, teamId: string): Promise<boolean> {
  if (user.role === "ADMIN") return true;
  if (user.role !== "COACH") return false;
  const teams = await coachTeamIds(user.id);
  return teams.includes(teamId);
}

export function canViewOwnProfile(user: SessionUser, targetUserId: string): boolean {
  return user.id === targetUserId;
}

/** Resolves a team by slug and the player within it, or returns null if the
 * team/player doesn't exist or the requesting user can't manage that team. */
export async function getManagedTeamPlayer(
  user: SessionUser,
  teamSlug: string,
  userId: string
) {
  const team = await db.team.findUnique({ where: { slug: teamSlug } });
  if (!team) return null;
  if (!(await canManageTeam(user, team.id))) return null;

  const player = await db.user.findUnique({ where: { id: userId } });
  if (!player || player.teamId !== team.id) return null;

  return { team, player };
}
