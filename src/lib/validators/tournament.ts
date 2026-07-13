import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  organizer: z.string().optional(),
  startDate: z.string().min(1, "Informe a data de início"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const registerTeamSchema = z.object({
  teamId: z.string().min(1),
  tournamentId: z.string().min(1),
  notes: z.string().optional(),
});
