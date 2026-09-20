import React from 'react';
import type { Props } from './interfaces/props.interface';
import { SkeletonTemplate } from './skeleton.html';
import { LOADING_LABEL } from './constants/loading-label.constant';
import { SHELL_BY_MODE } from './constants/shell-by-mode.constant';
import { shimmerClass } from './utils/shimmer-class.util';
import styles from './skeleton.module.css';
import feedStyles from '../views/feed/view.module.css';

export const Skeleton: React.FC<Props> = ({ viewMode }) => {
  const bodyClassName =
    viewMode === 'compact' || viewMode === 'grid'
      ? `${styles['skeleton__body']} ${styles['skeleton__body--tight']}`
      : styles['skeleton__body'];

  return (
    <SkeletonTemplate
      viewMode = {
        viewMode
      }
      label = {
        LOADING_LABEL
      }
      shellClassName = {
        SHELL_BY_MODE[viewMode]
      }
      innerClassName = {
        feedStyles['view__card']
      }
      bodyClassName = {
        bodyClassName
      }
      rowClassName = {
        styles['skeleton__row']
      }
      barTitleClassName = {
        shimmerClass(styles['skeleton__bar'], styles['skeleton__bar--title'])
      }
      barPillClassName = {
        shimmerClass(styles['skeleton__bar'], styles['skeleton__bar--pill'])
      }
      barMetaClassName = {
        shimmerClass(styles['skeleton__bar'], styles['skeleton__bar--meta'])
      }
      barLineClassName = {
        shimmerClass(styles['skeleton__bar'], styles['skeleton__bar--line'])
      }
      barShortClassName = {
        shimmerClass(styles['skeleton__bar'], styles['skeleton__bar--short'])
      }
      thumbClassName = {
        shimmerClass(styles['skeleton__thumb'])
      }
      avatarClassName = {
        shimmerClass(styles['skeleton__avatar'])
      }
    />
  );
};
