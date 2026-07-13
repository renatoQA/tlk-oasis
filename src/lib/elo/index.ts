import { EloProvider } from "./provider";
import { trackerProvider } from "./tracker-provider";
import { manualProvider } from "./manual-provider";

export function getEloProvider(): EloProvider {
  return process.env.TRACKER_API_KEY ? trackerProvider : manualProvider;
}

export * from "./provider";
