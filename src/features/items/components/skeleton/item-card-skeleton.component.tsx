import React from 'react';
import { ItemCardSkeletonProps } from './interfaces/item-card-skeleton-props.interface';
import { ItemCardSkeletonTemplate } from './item-card-skeleton.html';

export const ItemCardSkeleton: React.FC<ItemCardSkeletonProps> = ({ viewMode }) => (
  <ItemCardSkeletonTemplate viewMode={viewMode} label="Loading item details" />
);
