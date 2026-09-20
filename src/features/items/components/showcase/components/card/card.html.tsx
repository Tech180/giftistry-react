import React from 'react';
import { Copy, Star, Tag } from 'lucide-react';
import { FundingWidget, LinksWidget } from '../../../item-presentation';
import { ClaimFooter } from '../claim-footer/claim-footer.component';
import { MetaBadges } from '../meta-badges/meta-badges.component';
import { Photo } from '../photo/photo.component';
import { Title } from '../title/title.component';
import { VariationsProgress } from '../variations-progress/variations-progress.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const CardTemplate: React.FC<TemplateProps> = (props) => {
  return (
    <>
      <Photo
        imageUrl = {
          props.primaryImageUrl
        }
      />
      <div className={props.headerClassName}>
        <div className={props.titleAreaClassName}>
          <div className={props.metaLineClassName}>
            <span className={props.categoryClassName}>
              <Tag size={12} className={props.actionIconClassName} />
              {props.displayCategory}
            </span>
          </div>
          <Title
            variant = {
              'card'
            }
            name = {
              props.displayItem.Name
            }
            isLinkedToItems = {
              props.isLinkedToItems
            }
            isRelatedToItems = {
              props.isRelatedToItems
            }
            substitutionKind = {
              props.substitutionKind
            }
            substitutionCreatedByUserId = {
              props.substitutionCreatedByUserId
            }
          />
          {props.showHiddenSuggestionBadge ? (
            <span className={props.statusBadgeClassName}>
              Collaborator Suggestion (Hidden from list owner)
            </span>
          ) : null}
          {props.showSuggestionBadge ? (
            <span className={props.statusBadgeClassName}>{props.suggestionLabel}</span>
          ) : null}
          {props.audienceLabel ? (
            <span className={props.audienceBadgeClassName}>{props.audienceLabel}</span>
          ) : null}
        </div>
        <div className={props.headerActionsClassName}>
          {props.localIsFavorite ? (
            <span className={props.starClassName} title="Favorite Item">
              <Star size={18} fill="currentColor" />
            </span>
          ) : null}
          {props.onCopyMarkdown ? (
            <button
              type="button"
              onClick={props.onCopyMarkdown}
              className={props.copyBtnClassName}
              title="Copy item as Markdown"
              aria-label="Copy item as Markdown"
            >
              <Copy size={16} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={props.onClose}
            className={props.closeBtnClassName}
            title="Close Preview"
          >
            &times;
          </button>
        </div>
      </div>

      <div className={props.bodyClassName}>
        <div className={props.gridClassName}>
          <div className={props.infoColClassName}>
            {props.displayDescription ? (
              <div className={props.descriptionBoxClassName}>
                <h4 className={props.sectionTitleClassName}>Description</h4>
                <p className={props.descriptionTextClassName}>{props.displayDescription}</p>
              </div>
            ) : (
              <div className={props.emptyDescriptionClassName}>
                <p>No description provided for this item.</p>
              </div>
            )}

            <MetaBadges
              entries = {
                props.predefinedEntries
              }
              sectionTitle = {
                'Details / Sizing'
              }
              sectionVariant = {
                'card'
              }
            />

            {props.userDefinedEntries.map((field) => (
              <div key={field.name} className={props.descriptionBoxClassName}>
                <h4 className={props.sectionTitleClassName}>{field.name}</h4>
                <p className={props.descriptionTextClassName}>{field.value}</p>
              </div>
            ))}

            {props.showVariationsProgress ? (
              <VariationsProgress
                variations = {
                  props.variationProgress
                }
                sectionTitle = {
                  'Variations Progress'
                }
                sectionVariant = {
                  'card'
                }
              />
            ) : null}
          </div>

          <div className={props.actionColClassName}>
            <div className={props.priceContainerClassName}>
              <span className={props.priceLabelClassName}>Price</span>
              <span className={props.priceValueClassName}>{props.bestPriceDisplay}</span>
            </div>

            {props.showQuantityProgress ? (
              <div className={props.fundingSectionClassName}>
                <div className={props.fundingHeaderClassName}>
                  <span>Quantities Claimed</span>
                  <span>{props.quantityProgressMetric}</span>
                </div>
                <div className={props.progressBarBgClassName}>
                  <div
                    className={props.progressBarFillClassName}
                    style={{ width: `${props.progressPercent}%` }}
                  />
                </div>
              </div>
            ) : props.showGroupFunding ? (
              <FundingWidget
                totalExtractedPrice = {
                  props.totalExtractedPrice
                }
                totalClaimedAmount = {
                  props.totalClaimedAmount
                }
                label = {
                  'Group Funding Progress'
                }
              />
            ) : null}

            <div className={props.linksSectionClassName}>
              <h4 className={props.sectionTitleClassName}>Purchase Links</h4>
              <LinksWidget
                links = {
                  props.displayItem.Links
                }
                getSiteName = {
                  props.getSiteName
                }
              />
            </div>

            <div className={props.actionsAreaClassName}>
              <ClaimFooter
                {...props.claimFooter}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
