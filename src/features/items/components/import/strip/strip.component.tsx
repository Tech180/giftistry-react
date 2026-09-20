import React, { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import { getWishlistImportAccept } from 'features/items/constants/wishlist-import.constants';
import type { WishlistImportExtension } from 'features/items/interfaces/wishlist-import-extension.type';
import { useItemsSession } from '../../../providers/session';
import { useImportFlow } from 'features/items/hooks/use-import-flow';
import type { Handle } from './interfaces/handle.interface';
import type { Props } from './interfaces/props.interface';
import type { Status as DropzoneStatus } from '../dropzone/interfaces/props.interface';
import { buildStatus } from './utils/build-status.util';
import { StripTemplate } from './strip.html';
import styles from './strip.module.css';

export type { Handle as ImportStripHandle } from './interfaces/handle.interface';

export const Strip = forwardRef<Handle, Props>(function Strip(
  { mode, listId, isExpanded, onImported, className },
  ref
) {
  const { canShowAi } = useItemsSession();
  const flow = useImportFlow({
    mode,
    listId,
    allowAi: canShowAi,
    onImported,
  });
  const menuFileInputRef = useRef<HTMLInputElement>(null);
  const defaultAccept = getWishlistImportAccept(canShowAi);
  const [pasteDraft, setPasteDraft] = useState('');
  const grabSwitchId = `import-grab-info-${useId().replace(/:/g, '')}`;
  const optimizeSwitchId = `import-optimize-categories-${useId().replace(/:/g, '')}`;
  const pasteId = `import-paste-${useId().replace(/:/g, '')}`;

  const stripStatus = buildStatus(flow.phase, {
    wishlistTitle: flow.wishlistTitle.trim() || 'Wishlist',
    errorMessage: flow.errorMessage,
    mode,
    uploadPercent: flow.uploadPercent,
    successMessage: flow.successMessage,
    successTone: flow.successTone,
  });

  const aiPanelActive = flow.grabInfoActive || flow.optimizeCategoriesActive;
  const showDropzone =
    flow.phase === 'idle' ||
    flow.phase === 'uploading' ||
    flow.phase === 'ready' ||
    flow.phase === 'error';
  const showPaste = flow.phase === 'idle' || (flow.phase === 'error' && !flow.fileName);
  const showProgress = flow.phase === 'creating' || flow.phase === 'success';
  const showTimeline = flow.timelineSteps.length > 0;
  const showActions =
    flow.phase === 'ready' ||
    flow.phase === 'success' ||
    (flow.phase === 'error' && Boolean(flow.fileName));
  const readyHasError = Boolean(flow.errorMessage);
  const showHeaderMeta =
    Boolean(flow.fileName) &&
    (flow.phase === 'ready' ||
      flow.phase === 'creating' ||
      flow.phase === 'success' ||
      flow.phase === 'error');

  let dropzoneStatus: DropzoneStatus = 'idle';
  if (flow.phase === 'uploading') {
    dropzoneStatus = 'uploading';
  } else if (flow.phase === 'ready') {
    dropzoneStatus = flow.errorMessage ? 'error' : 'ready';
  } else if (flow.phase === 'error' && flow.fileName) {
    dropzoneStatus = 'error';
  }

  useImperativeHandle(
    ref,
    () => ({
      browse(extension?: WishlistImportExtension) {
        const input = menuFileInputRef.current;
        if (!input || flow.isBusy) {
          return;
        }
        input.accept = extension ? `.${extension}` : defaultAccept;
        input.click();
      },
      acceptFile(file: File) {
        if (flow.isBusy || !file) {
          return;
        }
        flow.handleFileSelected(file);
      },
    }),
    [flow.isBusy, flow.handleFileSelected, defaultAccept]
  );

  return (
    <>
      <input
        ref={menuFileInputRef}
        className={styles['strip__hidden-input']}
        type="file"
        accept={defaultAccept}
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          event.target.accept = defaultAccept;
          if (file) {
            flow.handleFileSelected(file);
          }
        }}
      />
      <StripTemplate
        mode = { mode }
        phase = { flow.phase }
        isExpanded = { isExpanded }
        stripStatus = { stripStatus }
        title = { mode === 'create-list' ? 'Import Wishlist' : 'Import Items' }
        dropzoneError = { flow.dropzoneError }
        errorMessage = { flow.errorMessage }
        uploadPercent = { flow.uploadPercent }
        uploadLabel = { flow.uploadLabel }
        fileName = { flow.fileName }
        wishlistTitle = { flow.wishlistTitle }
        setWishlistTitle = { flow.setWishlistTitle }
        timelineSteps = { flow.timelineSteps }
        timelineStreams = { flow.timelineStreams }
        streamsCaption = { flow.streamsCaption }
        createLabel = { flow.createLabel }
        isBusy = { flow.isBusy }
        canConfirm = { flow.canConfirm }
        canGrabInfo = { flow.canGrabInfo }
        grabInfoActive = { flow.grabInfoActive }
        canOptimizeCategories = { flow.canOptimizeCategories }
        optimizeCategoriesActive = { flow.optimizeCategoriesActive }
        allowAi = { flow.allowAi }
        confirmLabel = { flow.confirmLabel }
        className = { className }
        grabSwitchId = { grabSwitchId }
        optimizeSwitchId = { optimizeSwitchId }
        pasteId = { pasteId }
        pasteDraft = { pasteDraft }
        setPasteDraft = { setPasteDraft }
        onFileSelected = { flow.handleFileSelected }
        onPasteText = { flow.acceptPastedText }
        onReset = { flow.resetState }
        onConfirm = { flow.handleConfirm }
        onGrabInfoChange = { flow.handleGrabInfoChange }
        onOptimizeCategoriesChange = { flow.handleOptimizeCategoriesChange }
        aiPanelActive = { aiPanelActive }
        showDropzone = { showDropzone }
        showPaste = { showPaste }
        showProgress = { showProgress }
        showTimeline = { showTimeline }
        showActions = { showActions }
        readyHasError = { readyHasError }
        showHeaderMeta = { showHeaderMeta }
        dropzoneStatus = { dropzoneStatus }
      />
    </>
  );
});
