import { EloProvider, EloProviderError, EloLookupInput, EloLookupResult } from "./provider";

const TRACKER_API_BASE = "https://public-api.tracker.gg/v2/valorant/standard/profile";

// Endpoint/response shape is based on Tracker.gg's public developer API docs
// (developer.tracker.gg) at time of writing. Confirm against the latest docs
// once TRACKER_API_KEY is approved - Tracker may adjust field names over time.
export const trackerProvider: EloProvider = {
  name: "tracker.gg",
  isConfigured: Boolean(process.env.TRACKER_API_KEY),

  async fetchElo(input: EloLookupInput): Promise<EloLookupResult> {
    const apiKey = process.env.TRACKER_API_KEY;
    if (!apiKey) {
      throw new EloProviderError("not_configured");
    }

    const riotId = `${input.gameName}#${input.tagLine}`;
    const url = `${TRACKER_API_BASE}/riot/${encodeURIComponent(riotId)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "TRN-Api-Key": apiKey },
        next: { revalidate: 0 },
      });
    } catch {
      throw new EloProviderError("unknown", "Falha de rede ao contatar Tracker.gg");
    }

    if (response.status === 401 || response.status === 403) {
      throw new EloProviderError("unauthorized", "Chave da API Tracker.gg inválida ou não autorizada");
    }
    if (response.status === 404) {
      throw new EloProviderError("not_found", "Riot ID não encontrado no Tracker.gg");
    }
    if (response.status === 429) {
      throw new EloProviderError("rate_limited", "Limite de requisições do Tracker.gg atingido");
    }
    if (!response.ok) {
      throw new EloProviderError("unknown", `Tracker.gg respondeu com status ${response.status}`);
    }

    const json = await response.json();
    const segments = json?.data?.segments ?? [];
    const rankedSegment = segments.find((s: { type?: string }) => s.type === "season") ?? segments[0];

    const stats = rankedSegment?.stats ?? {};
    const currentRr: number | null = stats?.rank?.value ?? stats?.peakRank?.value ?? null;
    const currentTier: string | null = stats?.rank?.metadata?.tierName ?? null;
    const peakRr: number | null = stats?.peakRank?.value ?? null;
    const peakTier: string | null = stats?.peakRank?.metadata?.tierName ?? null;

    return { currentRr, currentTier, peakRr, peakTier, raw: json };
  },
};
