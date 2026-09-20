import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useAuth } from 'features/auth';
import { expiresAtIsoToDateInput } from 'features/wishlists';
import {
  exportToCsv,
  exportToXlsx,
  exportToTxt,
  exportToJson,
  exportToPdf,
} from 'shared/utils/wishlist-export';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { BACK_LINK_AUTH_LABEL, BACK_LINK_GUEST_LABEL } from './constants/back-link-labels.constant';
import { CONFIRM_MESSAGES } from './constants/confirm-messages.constant';
import type { Props } from './interfaces/props.interface';
import { getConfirmBannerClassName } from './utils/get-confirm-banner-class-name.util';
import { getConfirmYesBtnClassName } from './utils/get-confirm-yes-btn-class-name.util';
import { HeaderTemplate } from './header.html';
import styles from './header.module.css';

export const Header: React.FC<Props> = (props) => {
  const {
    wishlist,
    isOwner,
    isPublicGuest = false,
    isArchived,
    confirmAction,
    setConfirmAction,
    handleDeactivateConfirm,
    handleActivateConfirm,
    handleDeleteConfirm,
    onDuplicate,
    isCommentsOpen,
    setIsCommentsOpen,
    setIsShareOpen,
  } = props;
  const { canShowAi, canShowWebSearch, user } = useAuth();

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isListSettingsOpen, setIsListSettingsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(wishlist.Title);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState('');

  const exportRef = useRef<HTMLDivElement>(null);
  const listSettingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempTitle(wishlist.Title);
  }, [wishlist.Title]);

  useEffect(() => {
    setTempDate(expiresAtIsoToDateInput(wishlist.ExpiresAt));
  }, [wishlist.ExpiresAt]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (exportRef.current && !exportRef.current.contains(target)) {
        setIsExportDropdownOpen(false);
      }
      if (listSettingsRef.current && !listSettingsRef.current.contains(target)) {
        setIsListSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveTitle = async (newTitle: string) => {
    try {
      await props.saveTitle(newTitle);
    } catch (_) {
      setTempTitle(wishlist.Title);
    }
  };

  const handleSaveDate = async (newDateStr: string) => {
    try {
      await props.saveDate(newDateStr);
    } catch (_) {
      setTempDate(expiresAtIsoToDateInput(wishlist.ExpiresAt));
    }
  };

  const exporterName = user?.FirstName || user?.Username || 'Export';
  const exportContext = {
    exporterName,
    isOwner,
    currentUserId: user?.Id,
  };

  const closeExportMenu = () => setIsExportDropdownOpen(false);

  const onExportCsv = () => {
    exportToCsv(wishlist.Id, wishlist.Title, exportContext);
    closeExportMenu();
  };

  const onExportXlsx = () => {
    exportToXlsx(wishlist.Id, wishlist.Title, exportContext);
    closeExportMenu();
  };

  const onExportTxt = () => {
    exportToTxt(wishlist.Id, wishlist.Title, exportContext);
    closeExportMenu();
  };

  const onExportJson = () => {
    exportToJson(wishlist.Id, wishlist.Title, exportContext);
    closeExportMenu();
  };

  const onExportPdf = () => {
    exportToPdf(wishlist.Id, wishlist.Title, exportContext);
    closeExportMenu();
  };

  const showListSettings = !isPublicGuest;
  const listSettingsReadOnly = !isOwner || isArchived;
  const showOwnerBadgeRegion = !isOwner;
  const hideOwnerBadgeOnMobile = !isPublicGuest && !isOwner;
  const actionsBusy = props.isDeactivating || props.isActivating || props.isDeleting;

  const onConfirmYes = () => {
    if (confirmAction === 'deactivate') {
      handleDeactivateConfirm();
      return;
    }
    if (confirmAction === 'activate') {
      handleActivateConfirm();
      return;
    }
    if (confirmAction === 'duplicate') {
      onDuplicate();
      return;
    }
    if (confirmAction === 'delete') {
      handleDeleteConfirm();
    }
  };

  const commitTitleEdit = () => {
    void handleSaveTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const onTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitTitleEdit();
      return;
    }
    if (event.key === 'Escape') {
      setTempTitle(wishlist.Title);
      setIsEditingTitle(false);
    }
  };

  const onDateChange = (next: string) => {
    setTempDate(next);
    void handleSaveDate(next);
    setIsEditingDate(false);
  };

  const listSettingsPillClassName = [
    styles['header__action-pill'],
    listSettingsReadOnly ? styles['header__action-pill--muted'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const importPillClassName = [
    styles['header__action-pill'],
    wishlist.AiEnabled ? styles['header__action-pill--ai'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const ownerBadgeClassName = [
    styles['header__owner-badge'],
    hideOwnerBadgeOnMobile ? styles['header__owner-badge--hide-mobile'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <HeaderTemplate
      wishlist = {
        wishlist
      }
      items = {
        props.items
      }
      priorities = {
        props.priorities
      }
      isOwner = {
        isOwner
      }
      isPublicGuest = {
        isPublicGuest
      }
      onGoHome = {
        props.onGoHome
      }
      isExpired = {
        props.isExpired
      }
      isArchived = {
        isArchived
      }
      isDeactivating = {
        props.isDeactivating
      }
      isActivating = {
        props.isActivating
      }
      isDeleting = {
        props.isDeleting
      }
      confirmAction = {
        confirmAction
      }
      confirmMessage = {
        confirmAction ? CONFIRM_MESSAGES[confirmAction] : ''
      }
      confirmBannerClassName = {
        confirmAction ? getConfirmBannerClassName(confirmAction) : ''
      }
      confirmYesBtnClassName = {
        confirmAction ? getConfirmYesBtnClassName(confirmAction) : ''
      }
      onConfirmYes = {
        onConfirmYes
      }
      onConfirmNo = {
        () => setConfirmAction(null)
      }
      formatDate = {
        props.formatDate
      }
      toggleAiEnabled = {
        props.toggleAiEnabled
      }
      toggleWebSearchEnabled = {
        props.toggleWebSearchEnabled
      }
      toggleManualJobBackground = {
        props.toggleManualJobBackground
      }
      toggleAutoRollover = {
        props.toggleAutoRollover
      }
      toggleAllowGroupFunds = {
        props.toggleAllowGroupFunds
      }
      canShowAi = {
        canShowAi
      }
      canShowWebSearch = {
        canShowWebSearch
      }
      isCommentsOpen = {
        isCommentsOpen
      }
      canImport = {
        props.canImport
      }
      isImportOpen = {
        props.isImportOpen
      }
      onImportToggle = {
        props.onImportToggle
      }
      isDuplicating = {
        props.isDuplicating
      }
      duplicateLabel = {
        props.isDuplicating ? 'Duplicating…' : 'Duplicate'
      }
      isEditingTitle = {
        isEditingTitle
      }
      tempTitle = {
        tempTitle
      }
      onTitleChange = {
        setTempTitle
      }
      onTitleBlur = {
        commitTitleEdit
      }
      onTitleKeyDown = {
        onTitleKeyDown
      }
      onStartEditTitle = {
        () => setIsEditingTitle(true)
      }
      isEditingDate = {
        isEditingDate
      }
      tempDate = {
        tempDate
      }
      onDateChange = {
        onDateChange
      }
      onStartEditDate = {
        () => setIsEditingDate(true)
      }
      isExportDropdownOpen = {
        isExportDropdownOpen
      }
      exportRef = {
        exportRef
      }
      isListSettingsOpen = {
        isListSettingsOpen
      }
      listSettingsRef = {
        listSettingsRef
      }
      showListSettings = {
        showListSettings
      }
      listSettingsReadOnly = {
        listSettingsReadOnly
      }
      listSettingsPillClassName = {
        listSettingsPillClassName
      }
      showOwnerBadgeRegion = {
        showOwnerBadgeRegion
      }
      ownerBadgeClassName = {
        ownerBadgeClassName
      }
      ownerDisplayName = {
        getDisplayName(
          {
            FirstName: wishlist.OwnerFirstName,
            Username: wishlist.OwnerUsername,
          },
          'Registry Owner'
        )
      }
      backLinkLabel = {
        isPublicGuest ? BACK_LINK_GUEST_LABEL : BACK_LINK_AUTH_LABEL
      }
      actionsBusy = {
        actionsBusy
      }
      importPillClassName = {
        importPillClassName
      }
      onOpenShare = {
        () => setIsShareOpen(true)
      }
      onToggleComments = {
        () => setIsCommentsOpen(!isCommentsOpen)
      }
      onToggleListSettings = {
        () => setIsListSettingsOpen(!isListSettingsOpen)
      }
      onToggleExport = {
        () => setIsExportDropdownOpen(!isExportDropdownOpen)
      }
      onRequestActivate = {
        () => setConfirmAction('activate')
      }
      onRequestDeactivate = {
        () => setConfirmAction('deactivate')
      }
      onRequestDelete = {
        () => setConfirmAction('delete')
      }
      onRequestDuplicate = {
        () => setConfirmAction('duplicate')
      }
      onExportCsv = {
        onExportCsv
      }
      onExportXlsx = {
        onExportXlsx
      }
      onExportTxt = {
        onExportTxt
      }
      onExportJson = {
        onExportJson
      }
      onExportPdf = {
        onExportPdf
      }
    />
  );
};
