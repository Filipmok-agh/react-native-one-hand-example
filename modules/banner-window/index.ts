import { requireOptionalNativeModule } from 'expo';

type BannerWindowModule = {
  show: () => Promise<void>;
  hide: () => Promise<void>;
};

const nativeModule = requireOptionalNativeModule<BannerWindowModule>('BannerWindow');

/** Shows a small non-fullscreen UIWindow (iOS only; no-op elsewhere). */
export function showBannerWindow(): void {
  void nativeModule?.show();
}

export function hideBannerWindow(): void {
  void nativeModule?.hide();
}
