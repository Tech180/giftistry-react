import React from 'react';
import type { Props } from './interfaces/props.interface';
import { useShowcase } from './hooks/use-showcase';
import { ShowcaseTemplate } from './showcase.html';

export const Showcase: React.FC<Props> = (props) => {
  const templateProps = useShowcase(props);

  return (
    <ShowcaseTemplate
      {...templateProps}
    />
  );
};
