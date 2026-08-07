import React, { useState, useEffect, useRef } from 'react';
import { HeaderProps } from './interfaces/header-props.interface';
import { HeaderTemplate } from './header.html';
import { useAuth } from 'app/providers/auth-context';

export const Header: React.FC<HeaderProps> = (props) => {
  const { wishlist, isOwner } = props;
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
    const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
    setTempDate(prevDateStr);
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
      const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
      setTempDate(prevDateStr);
    }
  };

  const exporterName = user?.FirstName || user?.Username || 'Export';
  const exportContext = {
    exporterName,
    isOwner,
    currentUserId: user?.Id,
  };

  const showListSettings = isOwner && (canShowAi || canShowWebSearch);
  const showOwnerBadgeRegion =
    showListSettings ||
    (canShowAi && !isOwner && wishlist.AiEnabled) ||
    (canShowWebSearch && !isOwner && wishlist.WebSearchEnabled) ||
    !isOwner;

  return (
    <HeaderTemplate
      {...props}
      exportContext={exportContext}
      saveTitle={handleSaveTitle}
      saveDate={handleSaveDate}
      isExportDropdownOpen={isExportDropdownOpen}
      setIsExportDropdownOpen={setIsExportDropdownOpen}
      isEditingTitle={isEditingTitle}
      setIsEditingTitle={setIsEditingTitle}
      tempTitle={tempTitle}
      setTempTitle={setTempTitle}
      isEditingDate={isEditingDate}
      setIsEditingDate={setIsEditingDate}
      tempDate={tempDate}
      setTempDate={setTempDate}
      exportRef={exportRef}
      isListSettingsOpen={isListSettingsOpen}
      setIsListSettingsOpen={setIsListSettingsOpen}
      listSettingsRef={listSettingsRef}
      canShowAi={canShowAi}
      canShowWebSearch={canShowWebSearch}
      canImport={props.canImport}
      isImportOpen={props.isImportOpen}
      onImportToggle={props.onImportToggle}
      showListSettings={showListSettings}
      showOwnerBadgeRegion={showOwnerBadgeRegion}
    />
  );
};
