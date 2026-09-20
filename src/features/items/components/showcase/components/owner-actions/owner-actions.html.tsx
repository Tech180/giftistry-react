import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const OwnerActionsTemplate: React.FC<TemplateProps> = ({
  onEdit,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  onRequestDelete,
  deleteLoading,
  rootClassName,
  editButtonClassName,
  deleteButtonClassName,
  actionIconClassName,
  confirmWidgetClassName,
  confirmPromptClassName,
  confirmButtonsClassName,
}) => (
  <div className={rootClassName}>
    <Button
      variant = {
        'secondary'
      }
      className = {
        editButtonClassName
      }
      onClick = {
        onEdit
      }
    >
      <Edit2 size={12} className={actionIconClassName} /> Edit
    </Button>
    {showDeleteConfirm ? (
      <div className={confirmWidgetClassName}>
        <span className={confirmPromptClassName}>Delete?</span>
        <div className={confirmButtonsClassName}>
          <Button
            variant = {
              'primary'
            }
            size = {
              'sm'
            }
            onClick = {
              onConfirmDelete
            }
            isLoading = {
              deleteLoading
            }
          >
            Yes
          </Button>
          <Button
            variant = {
              'ghost'
            }
            size = {
              'sm'
            }
            onClick = {
              onCancelDelete
            }
          >
            No
          </Button>
        </div>
      </div>
    ) : (
      <Button
        variant = {
          'secondary'
        }
        className = {
          deleteButtonClassName
        }
        onClick = {
          onRequestDelete
        }
      >
        <Trash2 size={12} className={actionIconClassName} /> Delete
      </Button>
    )}
  </div>
);
