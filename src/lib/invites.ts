import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { Role } from "@/generated/prisma/enums";

const INVITE_TTL_DAYS = 7;

export async function createInvite(input: {
  email: string;
  role: Role;
  teamId?: string | null;
  createdById: string;
}) {
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
  return db.invite.create({
    data: {
      email: input.email,
      role: input.role,
      teamId: input.teamId ?? null,
      createdById: input.createdById,
      expiresAt,
    },
  });
}

export async function getValidInvite(token: string) {
  const invite = await db.invite.findUnique({ where: { token } });
  if (!invite) return { invite: null, error: "not_found" as const };
  if (invite.status !== "PENDING") return { invite: null, error: "not_pending" as const };
  if (invite.expiresAt < new Date()) return { invite: null, error: "expired" as const };
  return { invite, error: null };
}

export async function acceptInvite(input: {
  token: string;
  name: string;
  password: string;
  gameName?: string;
  tagLine?: string;
}) {
  return db.$transaction(async (tx) => {
    const invite = await tx.invite.findUnique({ where: { token: input.token } });
    if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
      throw new Error("Convite inválido ou expirado");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await tx.user.upsert({
      where: { email: invite.email },
      update: {
        name: input.name,
        passwordHash,
        role: invite.role,
        teamId: invite.teamId,
      },
      create: {
        email: invite.email,
        name: input.name,
        passwordHash,
        role: invite.role,
        teamId: invite.teamId,
      },
    });

    if (input.gameName && input.tagLine) {
      await tx.riotAccount.upsert({
        where: { userId: user.id },
        update: { gameName: input.gameName, tagLine: input.tagLine },
        create: { userId: user.id, gameName: input.gameName, tagLine: input.tagLine },
      });
    }

    await tx.invite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    return user;
  });
}
