import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

export async function getSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    redirect(homeForRole(session.user.role));
  }
  return session;
}

export function homeForRole(role: Role | undefined) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "COACH":
      return "/coach";
    case "PLAYER":
      return "/player";
    default:
      return "/login";
  }
}
