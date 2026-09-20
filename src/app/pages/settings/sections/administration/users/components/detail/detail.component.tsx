import React from 'react';
import type { SectionProps } from '../../../interfaces/section-props.interface';
import { DetailTemplate } from './detail.html';
import { useDetail } from './hooks/use-detail';

export const Detail: React.FC<SectionProps> = (props) => {
  const templateProps = useDetail(props);
  return <DetailTemplate {...templateProps} />;
};

export default Detail;
