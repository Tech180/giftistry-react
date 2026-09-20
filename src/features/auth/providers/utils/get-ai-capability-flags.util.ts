import type { AiCapabilities } from '../interfaces/ai-capabilities.interface';
import type { AiCapabilityFlags } from '../interfaces/ai-capability-flags.interface';
import type { GetAiCapabilityFlagsOptions } from '../interfaces/get-ai-capability-flags-options.interface';

export function getCanShowAi(capabilities: AiCapabilities | undefined): boolean {
  return capabilities?.CanUseAi ?? false;
}

export function getCanShowWebSearch(capabilities: AiCapabilities | undefined): boolean {
  return capabilities?.CanUseWebSearch ?? false;
}

export function getCanShowAiSettings(
  options: Pick<GetAiCapabilityFlagsOptions, 'globalAiEnabled' | 'user' | 'capabilities'>
): boolean {
  const { globalAiEnabled, user, capabilities } = options;

  if (!globalAiEnabled) {
    return false;
  }

  if (user?.Policy?.CanUseAiFeatures === false) {
    return false;
  }

  if (user?.Policy?.CanUseAiFeatures === true) {
    return true;
  }

  // Policy missing from payload: keep section if preference field or capability is known.
  return capabilities?.CanUseAi === true || typeof user?.AiEnabled === 'boolean';
}

export function getCanShowWebSearchSettings(
  options: Pick<
    GetAiCapabilityFlagsOptions,
    'globalWebSearchEnabled' | 'globalAiEnabled' | 'user' | 'capabilities'
  >
): boolean {
  const { globalWebSearchEnabled, globalAiEnabled, user, capabilities } = options;

  if (!globalWebSearchEnabled || !globalAiEnabled) {
    return false;
  }

  if (user?.Policy?.CanUseAiFeatures === false) {
    return false;
  }

  return (
    capabilities?.CanUseWebSearch === true ||
    typeof user?.WebSearchEnabled === 'boolean' ||
    user?.Policy?.CanUseAiFeatures === true
  );
}

export function getAiCapabilityFlags(options: GetAiCapabilityFlagsOptions): AiCapabilityFlags {
  const { globalAiEnabled, globalWebSearchEnabled, user, capabilities } = options;

  return {
    canShowAi: getCanShowAi(capabilities),
    canShowWebSearch: getCanShowWebSearch(capabilities),
    canShowAiSettings: getCanShowAiSettings({ globalAiEnabled, user, capabilities }),
    canShowWebSearchSettings: getCanShowWebSearchSettings({
      globalWebSearchEnabled,
      globalAiEnabled,
      user,
      capabilities,
    }),
  };
}
