import React from 'react';
import { INNER_TONE_CLASS, NODE_TONE_CLASS } from './constants/tone-class.constant';
import type { Props } from './interfaces/props.interface';
import { NodeTemplate } from './node.html';
import styles from './node.module.css';

export const Node: React.FC<Props> = ({ tone }) => {
  const nodeClassName = [styles.node, NODE_TONE_CLASS[tone]].filter(Boolean).join(' ');
  const innerClassName = [styles.inner, INNER_TONE_CLASS[tone]].filter(Boolean).join(' ');
  const checkClassName = [
    styles.check,
    tone === 'done' ? styles['check--done'] ?? '' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NodeTemplate
      nodeClassName = {
        nodeClassName
      }
      innerClassName = {
        innerClassName
      }
      checkClassName = {
        checkClassName
      }
    />
  );
};
