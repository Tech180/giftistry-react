import { useEffect } from 'react';
import type React from 'react';
import { jobsApi, waitForJob } from 'features/jobs';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { getSiteName } from 'shared/utils/get-site-name.util';
import { STANDARD_CATEGORIES } from '../../../constants/standard-categories';
import { ENRICH_FAILURE_FALLBACK } from '../../../constants/ai-helper-failure.constants';
import { toExtractMetadataResult } from '../../../utils/ai-job-result.util';
import { polishExtractMetadataForForm } from '../../../utils/polish-extract-metadata-for-form.util';
import { formatAiHelperFailure } from '../../../utils/format-ai-helper-failure.util';
import { resolveItemEnrichRequest } from '../../../utils/resolve-item-enrich-request.util';
import type { ExtractMetadataResult } from '../../../interfaces/extract-metadata-result.interface';
import type { Item } from '../../../interfaces/item.interface';
import type { SubstitutionEditorState } from '../interfaces/substitution-editor-state.type';
import type { PendingManualJob } from '../../../interfaces/pending-manual-job.interface';
import type { UseEnrichResult } from '../interfaces/use-enrich-result.interface';

export function useEnrich(options: {
  listId: string;
  item: Item | null | undefined;
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  setWebsiteName: (val: string) => void;
  setName: (val: string) => void;
  setPrice: (val: string) => void;
  setDescription: (val: string) => void;
  setCategory: (val: string) => void;
  setHasScraped: (val: boolean) => void;
  setShowExtraFields: (val: boolean) => void;
  setErrorMsg: (val: string | null) => void;
  setWarningMsg: (val: string | null) => void;
  canShowAi: boolean;
  isAutopopulating: boolean;
  setIsAutopopulating: (val: boolean) => void;
  isSummarizingNotes: boolean;
  hasScraped: boolean;
  sessionCustomCategories: string[];
  setSessionCustomCategories: React.Dispatch<React.SetStateAction<string[]>>;
  deletedCategories: string[];
  setDeletedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setAiCategoryPrimary: (val: string | null) => void;
  setAiCategoryAlternatives: (val: string[]) => void;
  pendingExtractedRef: React.RefObject<ExtractMetadataResult | null>;
  applyExtractedCustomFields: (data: ExtractMetadataResult) => void;
  substitutionEditorRef: React.RefObject<SubstitutionEditorState | null>;
  pendingJobRef: React.RefObject<PendingManualJob | null>;
  startJobRun: () => () => boolean;
  onItemEnriched?: () => void;
}): UseEnrichResult {
  const {
    listId,
    item,
    linkUrl,
    setLinkUrl,
    setWebsiteName,
    setName,
    setPrice,
    setDescription,
    setCategory,
    setHasScraped,
    setShowExtraFields,
    setErrorMsg,
    setWarningMsg,
    canShowAi,
    isAutopopulating,
    setIsAutopopulating,
    isSummarizingNotes,
    hasScraped,
    sessionCustomCategories,
    setSessionCustomCategories,
    deletedCategories,
    setDeletedCategories,
    setAiCategoryPrimary,
    setAiCategoryAlternatives,
    pendingExtractedRef,
    applyExtractedCustomFields,
    substitutionEditorRef,
    pendingJobRef,
    startJobRun,
    onItemEnriched,
  } = options;

  useEffect(() => {
    setHasScraped(false);
  }, [linkUrl, setHasScraped]);

  const applyExtractedMetadata = (data: ExtractMetadataResult) => {
    setHasScraped(true);
    setName(data.Title || '');
    setPrice(data.Price !== null && data.Price !== undefined ? data.Price.toString() : '');
    setDescription(data.Description || '');
    const resolvedLink = data.ResolvedUrl?.trim();
    if (resolvedLink) {
      setLinkUrl(resolvedLink);
    }
    const resolvedWebsiteName =
      data.WebsiteName?.trim() || getSiteName((resolvedLink || linkUrl).trim()) || '';
    if (resolvedWebsiteName) {
      setWebsiteName(resolvedWebsiteName);
    }

    const resolvedCategory = data.Category?.trim() || 'uncategorized';
    if (canShowAi && resolvedCategory !== 'uncategorized') {
      const isStandard = STANDARD_CATEGORIES.some((s) => s.id === resolvedCategory);
      if (!isStandard && !sessionCustomCategories.includes(resolvedCategory)) {
        setSessionCustomCategories((prev) => [...prev, resolvedCategory]);
      }
      if (deletedCategories.includes(resolvedCategory)) {
        setDeletedCategories((prev) => prev.filter((c) => c !== resolvedCategory));
      }
      setAiCategoryPrimary(resolvedCategory);
      setAiCategoryAlternatives(
        (data.CategoryAlternatives ?? []).filter(
          (alt) => alt && alt !== 'uncategorized' && alt !== resolvedCategory
        )
      );
      setCategory(resolvedCategory);
    } else {
      setAiCategoryPrimary(null);
      setAiCategoryAlternatives([]);
      setCategory(resolvedCategory);
    }

    pendingExtractedRef.current = data;
    applyExtractedCustomFields(data);
    setShowExtraFields(true);
  };

  const runExtractMetadata = async () => {
    if (!linkUrl.trim() || isAutopopulating || isSummarizingNotes) {
      return;
    }

    if (!isValidUrl(linkUrl)) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    const isCancelled = startJobRun();
    setIsAutopopulating(true);
    setErrorMsg(null);
    setWarningMsg(null);
    try {
      const isSubstitutionEditor = !!substitutionEditorRef.current;
      const enrichRequest = resolveItemEnrichRequest({
        persistedItemId: item?.Id,
        isSubstitutionEditor,
      });
      const { Job } = await jobsApi.startItemEnrich({
        intent: enrichRequest.intent,
        listId,
        url: linkUrl.trim(),
        itemId: enrichRequest.itemId,
        writeBack: enrichRequest.writeBack,
      });

      if (isCancelled()) {
        return;
      }
      pendingJobRef.current = {
        jobId: Job.Id,
        kind: 'enrich',
        intent: enrichRequest.intent,
        url: linkUrl.trim(),
        promoteOnClose: isSubstitutionEditor ? false : undefined,
      };

      const finished = await waitForJob(Job.Id, { isCancelled });
      if (!finished || isCancelled()) {
        return;
      }

      const data = finished.Status === 'completed' ? toExtractMetadataResult(finished.Result) : null;
      if (!data) {
        throw new Error(finished.Error || finished.Message || 'Enrich job failed');
      }

      applyExtractedMetadata(polishExtractMetadataForForm(data));
      if (canShowAi && data.Diagnostics?.AiPopulate === 'failed') {
        setWarningMsg('Product details were found, but AI summarization has failed.');
      }
      if (enrichRequest.intent === 'update-item') {
        onItemEnriched?.();
      }
    } catch (err) {
      if (isCancelled()) {
        return;
      }
      setWarningMsg(null);
      setErrorMsg(formatAiHelperFailure(err, ENRICH_FAILURE_FALLBACK));
    } finally {
      if (!isCancelled()) {
        pendingJobRef.current = null;
        setIsAutopopulating(false);
      }
    }
  };

  const handleScrapeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await runExtractMetadata();
  };

  const isScrapeButtonPulsing =
    isValidUrl(linkUrl) && !hasScraped && !isAutopopulating && !isSummarizingNotes;

  return {
    isAutopopulating,
    setIsAutopopulating,
    isScrapeButtonPulsing,
    handleScrapeClick,
    applyExtractedMetadata,
  };
}
