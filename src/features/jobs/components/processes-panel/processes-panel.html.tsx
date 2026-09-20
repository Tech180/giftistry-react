import React from 'react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ProcessesPanelTemplate: React.FC<TemplateProps> = ({
  title,
  subtitle,
  emptyLabel,
  error,
  isLoadingEmpty,
  isEmpty,
  rows,
  onCancel,
  onSuspend,
  onResume,
  rootClassName,
  headerClassName,
  titleClassName,
  subtitleClassName,
  errorClassName,
  emptyClassName,
  listClassName,
  rowClassName,
  rowHeaderClassName,
  rowTopClassName,
  rowTitleClassName,
  rowMetaClassName,
  rowMessageClassName,
  trackClassName,
  actionsClassName,
}) => {
  return (
    <section className={rootClassName} aria-label={title}>
      <div className={headerClassName}>
        <h2 className={titleClassName}>{title}</h2>
        <p className={subtitleClassName}>{subtitle}</p>
      </div>

      {error ? <p className={errorClassName}>{error}</p> : null}

      {isLoadingEmpty ? (
        <p className={emptyClassName}>Loading…</p>
      ) : isEmpty ? (
        <p className={emptyClassName}>{emptyLabel}</p>
      ) : (
        <ul className={listClassName}>
          {rows.map((row) => (
            <li key={row.id} className={rowClassName}>
              <div className={rowHeaderClassName}>
                <div className={rowTopClassName}>
                  <p className={rowTitleClassName} title={row.title}>
                    {row.title}
                  </p>
                  {row.meta ? <p className={rowMetaClassName}>{row.meta}</p> : null}
                  <p className={rowMessageClassName}>{row.message}</p>
                </div>
                <span className={row.statusBadgeClassName}>{row.status}</span>
              </div>
              <div
                className={trackClassName}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={row.percent}
                aria-label={row.progressLabel}
              >
                <div
                  className={row.fillClassName}
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <div className={actionsClassName}>
                {row.canSuspend ? (
                  <Button
                    type = {
                      'button'
                    }
                    variant = {
                      'secondary'
                    }
                    size = {
                      'sm'
                    }
                    onClick = {
                      () => onSuspend(row.id)
                    }
                  >
                    Suspend
                  </Button>
                ) : null}
                {row.canResume ? (
                  <Button
                    type = {
                      'button'
                    }
                    variant = {
                      'secondary'
                    }
                    size = {
                      'sm'
                    }
                    onClick = {
                      () => onResume(row.id)
                    }
                  >
                    Resume
                  </Button>
                ) : null}
                {row.canCancel ? (
                  <Button
                    type = {
                      'button'
                    }
                    variant = {
                      'secondary'
                    }
                    size = {
                      'sm'
                    }
                    onClick = {
                      () => onCancel(row.id)
                    }
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
