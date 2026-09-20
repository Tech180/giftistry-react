import React from 'react';
import { Row } from '../row/row.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const PanelTemplate: React.FC<TemplateProps> = ({
  streams,
  counter,
  panelClassName,
  headerClassName,
  headerRowClassName,
  titleClassName,
  counterClassName,
  listClassName,
}) => {
  return (
    <div className={panelClassName}>
      <div className={headerClassName}>
        <div className={headerRowClassName}>
          <span className={titleClassName}>Active Streams</span>
          <span className={counterClassName}>{counter}</span>
        </div>
      </div>
      <ol className={listClassName} aria-label="Active grab streams">
        {streams.map((lane) => (
          <Row
            key={lane.id}
            lane = {
              lane
            }
          />
        ))}
      </ol>
    </div>
  );
};
