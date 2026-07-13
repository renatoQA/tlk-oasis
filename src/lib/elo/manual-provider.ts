import { EloProvider, EloProviderError } from "./provider";

export const manualProvider: EloProvider = {
  name: "manual",
  isConfigured: false,
  async fetchElo() {
    throw new EloProviderError(
      "not_configured",
      "Integração com Tracker.gg ainda não configurada — use a entrada manual."
    );
  },
};
