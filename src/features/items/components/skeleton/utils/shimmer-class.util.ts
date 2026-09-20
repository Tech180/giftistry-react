import { SHIMMER_CLASS } from '../constants/shimmer-class.constant';

export function shimmerClass(...parts: Array<string | undefined>): string {
  return [SHIMMER_CLASS, ...parts.filter(Boolean)].join(' ');
}
