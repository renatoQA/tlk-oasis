export {};

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
    twttr?: { widgets: { load: () => void } };
  }
}
