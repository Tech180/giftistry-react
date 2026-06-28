import React, { useState, useEffect, useRef } from 'react';
import { HeaderProps } from './interfaces/header-props.interface';
import { HeaderTemplate } from './header.html';

export const Header: React.FC<HeaderProps> = (props) => {
  const { wishlist } = props;

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(wishlist.Title);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState('');

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempTitle(wishlist.Title);
  }, [wishlist.Title]);

  useEffect(() => {
    const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
    setTempDate(prevDateStr);
  }, [wishlist.ExpiresAt]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
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

  return (
    <HeaderTemplate
      {...props}
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
    />
  );
};
