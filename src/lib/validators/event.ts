import { z } from "zod";

export const createEventSchema = z.object({
  teamId: z.string().min(1),
  type: z.enum(["TRAINING", "SCRIM", "TOURNAMENT_MATCH", "MEETING"]),
  title: z.string().min(2, "Título muito curto"),
  description: z.string().optional(),
  startsAt: z.string().min(1, "Informe data/hora"),
  location: z.string().optional(),
  inviteAll: z.boolean().optional(),
  playerIds: z.array(z.string()).optional(),
});
