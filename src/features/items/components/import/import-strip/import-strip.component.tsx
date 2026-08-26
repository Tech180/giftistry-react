import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CollapsibleStripStatus } from 'shared/ui';
import { getWishlistImportAccept, type WishlistImportExtension } from 'features/items/constants/wishlist-import.constants';
import { useAuth } from 'app/providers/auth-context';
import { useImportFlow } from 'features/items/hooks/use-import-flow';
import type { ImportStripHandle } from './interfaces/import-strip-handle.interface';
import type { ImportStripPhase, ImportStripProps } from './interfaces/import-strip-props.interface';
import { ImportStripTemplate } from './import-strip.html';
import styles from './import-strip.module.css';

export type { ImportStripHandle } from './interfaces/import-strip-handle.interface';

function buildStatus(
  phase: ImportStripPhase,
  options: {
    wishlistTitle: string;
    errorMessage: string | null;
    mode: ImportStripProps['mode'];
    uploadPercent: number;
    successMessage?: string | null;
    successTone?: CollapsibleStripStatus['tone'];
  }
): CollapsibleStripStatus | undefined {
  switch (phase) {
    case 'uploading':
      return {
        tone: 'progress',
        message: `Uploading ${options.uploadPercent}%`,
      };
    case 'ready':
    case 'creating':
      return undefined;
    case 'success':
      return {
        tone: options.successTone ?? 'success',
        message:
          options.successMessage ||
          (options.mode === 'create-list'
            ? `Import finished for “${options.wishlistTitle}”`
            : 'Import finished'),
      };
    case 'error':
      return {
        tone: 'error',
        message: options.errorMessage || 'Import failed',
      };
    default:
      return { tone: 'idle', message: 'Drop a file or browse to import' };
  }
}

export const ImportStrip = forwardRef<ImportStripHandle, ImportStripProps>(function ImportStrip(
  { mode, listId, isExpanded, onImported, className },
  ref
) {
  const { canShowAi } = useAuth();
  const flow = useImportFlow({
    mode,
    listId,
    allowAi: canShowAi,
    onImported,
  });
  const menuFileInputRef = useRef<HTMLInputElement>(null);
  const defaultAccept = getWishlistImportAccept(canShowAi);

  const stripStatus = buildStatus(flow.phase, {
    wishlistTitle: flow.wishlistTitle.trim() || 'Wishlist',
    errorMessage: flow.errorMessage,
    mode,
    uploadPercent: flow.uploadPercent,
    successMessage: flow.successMessage,
    successTone: flow.successTone,
  });

  useImperativeHandle(
    ref,
    () => ({
      browse(extension?: WishlistImportExtension) {
        const input = menuFileInputRef.current;
        if (!input || flow.isBusy) return;
        input.accept = extension ? `.${extension}` : defaultAccept;
        input.click();
      },
      acceptFile(file: File) {
        if (flow.isBusy || !file) return;
        flow.handleFileSelected(file);
      },
    }),
    [flow.isBusy, flow.handleFileSelected, defaultAccept]
  );

  return (
    <>
      <input
        ref={menuFileInputRef}
        className={styles.hiddenInput}
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
      <ImportStripTemplate
        mode={mode}
        phase={flow.phase}
        isExpanded={isExpanded}
        stripStatus={stripStatus}
        title={mode === 'create-list' ? 'Import Wishlist' : 'Import Items'}
        dropzoneError={flow.dropzoneError}
        errorMessage={flow.errorMessage}
        uploadPercent={flow.uploadPercent}
        uploadLabel={flow.uploadLabel}
        fileName={flow.fileName}
        warnings={[]}
        wishlistTitle={flow.wishlistTitle}
        setWishlistTitle={flow.setWishlistTitle}
        timelineSteps={flow.timelineSteps}
        timelineStreams={flow.timelineStreams}
        streamsCaption={flow.streamsCaption}
        createLabel={flow.createLabel}
        isBusy={flow.isBusy}
        canConfirm={flow.canConfirm}
        canGrabInfo={flow.canGrabInfo}
        grabInfoActive={flow.grabInfoActive}
        canOptimizeCategories={flow.canOptimizeCategories}
        optimizeCategoriesActive={flow.optimizeCategoriesActive}
        allowAi={flow.allowAi}
        confirmLabel={flow.confirmLabel}
        className={className}
        onFileSelected={flow.handleFileSelected}
        onPasteText={flow.acceptPastedText}
        onReset={flow.resetState}
        onConfirm={flow.handleConfirm}
        onGrabInfoChange={flow.handleGrabInfoChange}
        onOptimizeCategoriesChange={flow.handleOptimizeCategoriesChange}
      />
    </>
  );
});
