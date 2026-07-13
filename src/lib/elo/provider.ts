export interface EloLookupInput {
  gameName: string;
  tagLine: string;
  region?: string | null;
}

export interface EloLookupResult {
  currentRr: number | null;
  currentTier: string | null;
  peakRr: number | null;
  peakTier: string | null;
  raw: unknown;
}

export type EloProviderErrorReason =
  | "not_configured"
  | "not_found"
  | "unauthorized"
  | "rate_limited"
  | "unknown";

export class EloProviderError extends Error {
  reason: EloProviderErrorReason;
  constructor(reason: EloProviderErrorReason, message?: string) {
    super(message ?? reason);
    this.reason = reason;
  }
}

export interface EloProvider {
  name: string;
  isConfigured: boolean;
  fetchElo(input: EloLookupInput): Promise<EloLookupResult>;
}
