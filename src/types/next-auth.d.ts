import type { Role } from "@/generated/prisma/enums";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      teamId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    teamId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    uid: string;
    role: Role;
    teamId: string | null;
  }
}
