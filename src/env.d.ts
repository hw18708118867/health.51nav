/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA4_MEASUREMENT_ID?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
}

interface Window {
  __healthCalcHubLastTrackedPath?: string;
  gtag?: (...args: unknown[]) => void;
}
