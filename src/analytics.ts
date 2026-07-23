import type { MacArchitecture } from './download'

export type DownloadPlacement =
  | 'hero-primary'
  | 'hero-alternate'
  | 'navbar-desktop'
  | 'navbar-mobile'
  | 'footer-primary'
  | 'footer-alternate'

type PlausibleOptions = {
  props: Record<string, string>
}

declare global {
  interface Window {
    plausible?: {
      (eventName: string, options?: PlausibleOptions): void
      q?: IArguments[]
    }
  }
}

export function trackDownload(
  architecture: MacArchitecture,
  placement: DownloadPlacement,
  version: string,
): void {
  window.plausible?.('Download', {
    props: {
      architecture,
      placement,
      version,
    },
  })
}
