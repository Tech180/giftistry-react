import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ListReloadStrategy } from '../interfaces/list-reload-strategy.type';

/**
 * Chooses list refresh behavior when a list-scoped job finishes.
 * draft-populate / non-write-back summarize leave the form draft intact — skip fetch.
 * Other enrich/summarize jobs soft-reload items; imports need a full page reload.
 */
export function resolveListReloadOnJobTerminal(job: BackgroundJobView): ListReloadStrategy {
  if (job.Kind === 'item-enrich' || job.Kind === 'item-summarize') {
    if (job.WriteBack === false) {
      return 'none';
    }
    return 'items';
  }

  return 'full';
}
