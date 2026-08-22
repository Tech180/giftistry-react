import React, { useEffect } from 'react';
import { useImportFlow } from 'features/items/hooks/use-import-flow';
import type { ImportMenuPanelProps } from './interfaces/import-menu-panel-props.interface';
import { ImportMenuPanelTemplate } from './import-menu-panel.html';
import {
  IMPORT_MENU_PANEL_DETAILS_CREATE,
  IMPORT_MENU_PANEL_DETAILS_EXISTING,
  IMPORT_MENU_PANEL_IDLE,
} from './constants/import-menu-panel-size.constant';

export const ImportMenuPanel: React.FC<ImportMenuPanelProps> = ({
  mode,
  listId,
  allowAi,
  onClose,
  onSizeChange,
  onImported,
  setPanelEscapeHandler,
}) => {
  const flow = useImportFlow({
    mode,
    listId,
    allowAi,
    onImported,
  });
  const isDetails = Boolean(flow.fileName);
  const detailsSize =
    mode === 'create-list'
      ? IMPORT_MENU_PANEL_DETAILS_CREATE
      : IMPORT_MENU_PANEL_DETAILS_EXISTING;

  useEffect(() => {
    if (isDetails) {
      onSizeChange(detailsSize.width, detailsSize.height);
      return;
    }
    onSizeChange(IMPORT_MENU_PANEL_IDLE.width, IMPORT_MENU_PANEL_IDLE.height);
  }, [detailsSize.height, detailsSize.width, isDetails, onSizeChange]);

  useEffect(() => {
    setPanelEscapeHandler(() => {
      if (isDetails) {
        flow.resetState();
        return true;
      }
      onClose();
      return true;
    });
    return () => setPanelEscapeHandler(null);
  }, [flow.resetState, isDetails, onClose, setPanelEscapeHandler]);

  const handleClose = () => {
    flow.resetState();
    onClose();
  };

  const confirmBusyLabel =
    flow.phase === 'uploading' ? flow.uploadLabel : flow.createLabel;

  return (
    <ImportMenuPanelTemplate
      mode={mode}
      phase={flow.phase}
      isDetails={isDetails}
      allowAi={allowAi}
      fileName={flow.fileName}
      wishlistTitle={flow.wishlistTitle}
      setWishlistTitle={flow.setWishlistTitle}
      errorMessage={flow.errorMessage}
      isBusy={flow.isBusy}
      canConfirm={flow.canConfirm}
      grabInfoArmed={flow.grabInfoArmed}
      optimizeCategoriesArmed={flow.optimizeCategoriesArmed}
      confirmLabel={flow.confirmLabel}
      confirmBusyLabel={confirmBusyLabel}
      onClose={handleClose}
      onBack={flow.resetState}
      onFileSelected={flow.handleFileSelected}
      onConfirm={flow.handleConfirm}
      onGrabInfoChange={flow.handleGrabInfoChange}
      onOptimizeCategoriesChange={flow.handleOptimizeCategoriesChange}
    />
  );
};
