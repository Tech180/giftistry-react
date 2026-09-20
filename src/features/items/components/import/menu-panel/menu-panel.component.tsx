import React, { useEffect, useId } from 'react';
import { useImportFlow } from 'features/items/hooks/use-import-flow';
import type { Props } from './interfaces/props.interface';
import { MenuPanelTemplate } from './menu-panel.html';
import { DETAILS_CREATE, DETAILS_EXISTING, IDLE } from './constants/size.constant';

export const MenuPanel: React.FC<Props> = ({
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
  const detailsSize = mode === 'create-list' ? DETAILS_CREATE : DETAILS_EXISTING;
  const grabSwitchId = `import-menu-grab-info-${useId().replace(/:/g, '')}`;
  const optimizeSwitchId = `import-menu-optimize-categories-${useId().replace(/:/g, '')}`;
  const titleId = `import-menu-wishlist-title-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (isDetails) {
      onSizeChange(detailsSize.width, detailsSize.height);
      return;
    }
    onSizeChange(IDLE.width, IDLE.height);
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
  const aiPanelActive = flow.grabInfoArmed || flow.optimizeCategoriesArmed;
  const confirmDisabled = !flow.canConfirm || flow.isBusy;
  const confirmText = flow.phase === 'creating' ? confirmBusyLabel : flow.confirmLabel;
  const showReadingHint = flow.phase === 'uploading';

  return (
    <MenuPanelTemplate
      mode = { mode }
      phase = { flow.phase }
      isDetails = { isDetails }
      allowAi = { allowAi }
      fileName = { flow.fileName }
      wishlistTitle = { flow.wishlistTitle }
      setWishlistTitle = { flow.setWishlistTitle }
      errorMessage = { flow.errorMessage }
      isBusy = { flow.isBusy }
      grabInfoArmed = { flow.grabInfoArmed }
      optimizeCategoriesArmed = { flow.optimizeCategoriesArmed }
      confirmLabel = { flow.confirmLabel }
      confirmBusyLabel = { confirmBusyLabel }
      grabSwitchId = { grabSwitchId }
      optimizeSwitchId = { optimizeSwitchId }
      titleId = { titleId }
      onClose = { handleClose }
      onBack = { flow.resetState }
      onFileSelected = { flow.handleFileSelected }
      onConfirm = { flow.handleConfirm }
      onGrabInfoChange = { flow.handleGrabInfoChange }
      onOptimizeCategoriesChange = { flow.handleOptimizeCategoriesChange }
      aiPanelActive = { aiPanelActive }
      confirmDisabled = { confirmDisabled }
      confirmText = { confirmText }
      showReadingHint = { showReadingHint }
    />
  );
};
