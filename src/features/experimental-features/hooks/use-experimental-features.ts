import { useCallback, useMemo, useState } from 'react';
import { useAuth } from 'features/auth';
import { experimentalFeaturesApi } from '../api/experimental-features.api';
import { EXPERIMENTAL_FEATURES } from '../constants/experimental-features.constant';
import type { ExperimentalFeatureId } from '../interfaces/experimental-feature-id.type';
import type { ExperimentalFeaturesMap } from '../interfaces/experimental-features-map.interface';
import type { Props } from '../interfaces/use-experimental-features-props.interface';
import type { Result } from '../interfaces/use-experimental-features-result.interface';
import { isExperimentalFeatureEnabled } from '../utils/is-experimental-feature-enabled.util';
import { mapExperimentalFeaturesFromApi } from '../utils/map-experimental-features.util';

export function useExperimentalFeatures({ showToast }: Props): Result {
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [optimistic, setOptimistic] = useState<ExperimentalFeaturesMap | null>(null);

  const features = useMemo(() => {
    const fromUser = mapExperimentalFeaturesFromApi(user?.ExperimentalFeatures);
    return optimistic ? { ...fromUser, ...optimistic } : fromUser;
  }, [user?.ExperimentalFeatures, optimistic]);

  const isEnabled = useCallback(
    (id: ExperimentalFeatureId) => isExperimentalFeatureEnabled(id, features),
    [features]
  );

  const onToggle = useCallback(
    async (id: ExperimentalFeatureId, enabled: boolean) => {
      const previous = features;
      setOptimistic({ ...features, [id]: enabled });
      setIsSaving(true);
      try {
        await experimentalFeaturesApi.patchFeatures({ [id]: enabled });
        await refreshUser();
        setOptimistic(null);
        showToast('Experimental preferences saved.', 'success');
      } catch (err) {
        setOptimistic(previous);
        showToast(
          err instanceof Error ? err.message : 'Failed to save experimental preferences.',
          'error'
        );
      } finally {
        setIsSaving(false);
      }
    },
    [features, refreshUser, showToast]
  );

  return {
    definitions: EXPERIMENTAL_FEATURES,
    features,
    isEnabled,
    isSaving,
    onToggle,
  };
}
