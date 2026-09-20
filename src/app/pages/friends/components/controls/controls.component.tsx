import React, { useEffect, useRef, useState } from 'react';
import type { SortMethod } from '../../interfaces/sort-method.type';
import type { Props } from './interfaces/props.interface';
import { ControlsTemplate } from './controls.html';

export const Controls: React.FC<Props> = (props) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const onToggleSort = () => setIsSortOpen((open) => !open);

  const onSelectSort = (method: SortMethod) => {
    props.onSortChange(method);
    setIsSortOpen(false);
  };

  return (
    <ControlsTemplate
      {...props}
      isSortOpen = {
        isSortOpen
      }
      dropdownRef = {
        dropdownRef
      }
      onToggleSort = {
        onToggleSort
      }
      onSelectSort = {
        onSelectSort
      }
    />
  );
};
