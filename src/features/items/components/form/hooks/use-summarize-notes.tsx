import type React from 'react';
import type { FieldDefinition } from '../../../api/items.api';
import type { Item } from '../../../interfaces/item.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { PendingManualJob } from '../../../interfaces/pending-manual-job.interface';
import { jobsApi, waitForJob } from 'features/jobs';
import { buildSummarizeCustomFields } from 'shared/utils/item-custom-fields.util';
import { parsePriorityWeight } from '../../../utils/parse-priority-weight.util';
import { toSummarizedDescription } from '../../../utils/ai-job-result.util';
import { formatAiHelperFailure } from '../../../utils/format-ai-helper-failure.util';
import { SUMMARIZE_FAILURE_FALLBACK } from '../../../constants/ai-helper-failure.constants';
import type { UseSummarizeNotesResult } from '../interfaces/use-summarize-notes-result.interface';

export function useSummarizeNotes(options: {
  canShowAi: boolean;
  listAiEnabled: boolean;
  listId: string;
  item: Item | null | undefined;
  name: string;
  description: string;
  setDescription: (val: string) => void;
  linkUrl: string;
  websiteName: string;
  price: string;
  category: string;
  priorityWeight: string;
  customFields: CustomFieldRow[];
  definitions: FieldDefinition[];
  dynamicValues: Record<string, string>;
  isFieldVisible: (def: FieldDefinition) => boolean;
  isMultiCount: boolean;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  isAutopopulating: boolean;
  isSummarizingNotes: boolean;
  setIsSummarizingNotes: (val: boolean) => void;
  undoDescription: string | null;
  setUndoDescription: (val: string | null) => void;
  setErrorMsg: (val: string | null) => void;
  setWarningMsg: (val: string | null) => void;
  pendingJobRef: React.RefObject<PendingManualJob | null>;
  startJobRun: () => () => boolean;
}): UseSummarizeNotesResult {
  const {
    canShowAi,
    listAiEnabled,
    listId,
    item,
    name,
    description,
    setDescription,
    linkUrl,
    websiteName,
    price,
    category,
    priorityWeight,
    customFields,
    definitions,
    dynamicValues,
    isFieldVisible,
    isMultiCount,
    desiredQuantity,
    variations,
    isAutopopulating,
    isSummarizingNotes,
    setIsSummarizingNotes,
    undoDescription,
    setUndoDescription,
    setErrorMsg,
    setWarningMsg,
    pendingJobRef,
    startJobRun,
  } = options;

  const canSummarizeNotes = canShowAi && listAiEnabled && !!name.trim();

  const handleSummarizeNotes = async () => {
    if (!canSummarizeNotes || isSummarizingNotes || isAutopopulating) {
      return;
    }

    const visibleDynamicValues: Record<string, string> = {};
    definitions.forEach((def) => {
      if (isFieldVisible(def)) {
        const val = dynamicValues[def.FieldKey];
        if (val?.trim()) {
          visibleDynamicValues[def.FieldKey] = val.trim();
        }
      }
    });

    const isCancelled = startJobRun();
    setUndoDescription(description);
    setIsSummarizingNotes(true);
    setErrorMsg(null);
    setWarningMsg(null);

    try {
      const summarizeCustomFields = buildSummarizeCustomFields({
        dynamicValues: visibleDynamicValues,
        customFieldRows: customFields.filter(
          (field) => field.name.trim() && field.value.trim()
        ),
      });

      const { Job } = await jobsApi.startItemSummarize({
        listId,
        itemId: item?.Id,
        writeBack: false,
        name: name.trim(),
        text: description.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        websiteName: websiteName.trim() || undefined,
        price: price.trim() ? parseFloat(price) : null,
        category: category === 'uncategorized' ? undefined : category,
        priority: parsePriorityWeight(priorityWeight),
        customFields: summarizeCustomFields,
        variations:
          isMultiCount && typeof desiredQuantity === 'number'
            ? variations.map((variation) => ({
                Name: variation.name,
                Quantity: variation.quantity,
              }))
            : undefined,
        desiredQuantity: typeof desiredQuantity === 'number' ? desiredQuantity : undefined,
      });

      if (isCancelled()) {
        return;
      }
      pendingJobRef.current = { jobId: Job.Id, kind: 'summarize' };

      const finished = await waitForJob(Job.Id, { isCancelled });
      if (!finished || isCancelled()) {
        return;
      }

      const summarized =
        finished.Status === 'completed' ? toSummarizedDescription(finished.Result) : null;
      if (!summarized) {
        throw new Error(finished.Error || finished.Message || 'Summarize job failed');
      }

      setDescription(summarized);
    } catch (err) {
      if (isCancelled()) {
        return;
      }
      setUndoDescription(null);
      setErrorMsg(formatAiHelperFailure(err, SUMMARIZE_FAILURE_FALLBACK));
    } finally {
      if (!isCancelled()) {
        pendingJobRef.current = null;
        setIsSummarizingNotes(false);
      }
    }
  };

  const handleUndoSummarize = () => {
    if (undoDescription === null) {
      return;
    }
    setDescription(undoDescription);
    setUndoDescription(null);
  };

  return {
    isSummarizingNotes,
    setIsSummarizingNotes,
    undoDescription,
    setUndoDescription,
    canSummarizeNotes,
    handleSummarizeNotes,
    handleUndoSummarize,
  };
}
