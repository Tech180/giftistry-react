import React from 'react';
import { FundingWidget, MetadataGrid } from '../../../../item-presentation';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ExpandedPanelTemplate: React.FC<TemplateProps> = ({
  showExpandedMetadata,
  hasFundingContent,
  primaryImageUrl,
  displayDescription,
  predefinedDisplayEntries,
  userDefinedEntries,
  metadataBadgeEmoji,
  totalExtractedPrice,
  totalClaimedAmount,
  rootClassName,
  contentClassName,
  photoColClassName,
  photoClassName,
  detailColClassName,
  descClassName,
  metadataClassName,
  asideClassName,
}) => (
  <div className={rootClassName}>
    <div className={contentClassName}>
      {primaryImageUrl ? (
        <div className={photoColClassName}>
          <img src={primaryImageUrl} alt="" className={photoClassName} />
        </div>
      ) : null}
      <div className={detailColClassName}>
        {displayDescription ? <p className={descClassName}>{displayDescription}</p> : null}
      </div>
      {showExpandedMetadata ? (
        <div className={metadataClassName}>
          <MetadataGrid
            predefinedDisplayEntries = {
              predefinedDisplayEntries
            }
            userDefinedEntries = {
              userDefinedEntries
            }
            metadataBadgeEmoji = {
              metadataBadgeEmoji
            }
            variant = {
              'compact'
            }
            compactAlign = {
              'end'
            }
          />
        </div>
      ) : null}
    </div>
    {hasFundingContent ? (
      <div className={asideClassName}>
        <FundingWidget
          totalExtractedPrice = {
            totalExtractedPrice
          }
          totalClaimedAmount = {
            totalClaimedAmount
          }
        />
      </div>
    ) : null}
  </div>
);
