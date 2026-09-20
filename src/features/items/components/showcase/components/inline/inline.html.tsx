import React from 'react';
import { Star } from 'lucide-react';
import { FundingWidget, LinksWidget, PriorityDisplay, QuantityBadge } from '../../../item-presentation';
import { MetaBadges } from '../meta-badges/meta-badges.component';
import { Photo } from '../photo/photo.component';
import { RelationList } from '../relation-list/relation-list.component';
import { Title } from '../title/title.component';
import { VariationsProgress } from '../variations-progress/variations-progress.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const InlineTemplate: React.FC<TemplateProps> = (props) => {
  return (
    <>
      <Photo
        imageUrl = {
          props.primaryImageUrl
        }
      />
      <div className={props.heroClassName}>
        <Title
          variant = {
            'inline'
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
        <div className={props.priceRowClassName}>
          <QuantityBadge
            item = {
              props.displayItem
            }
            metadata = {
              props.metadata
            }
            isOwner = {
              props.isOwner
            }
          />
          <span className={props.priceClassName}>{props.bestPriceDisplay}</span>
        </div>
        {props.showHeroMeta ? (
          <div className={props.heroMetaClassName}>
            {props.showSuggestionBadge ? (
              <span className={props.statusBadgeClassName}>{props.suggestionLabel}</span>
            ) : null}
            {props.showHiddenSuggestionBadge ? (
              <span className={props.statusBadgeClassName}>Hidden suggestion</span>
            ) : null}
            {props.audienceLabel ? (
              <span className={props.audienceBadgeClassName}>{props.audienceLabel}</span>
            ) : null}
            {props.localIsFavorite ? (
              <span className={props.starClassName} title="Favorite">
                <Star size={14} fill="currentColor" aria-hidden />
                Favorite
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={props.bodyClassName}>
        {props.hasNumericPriority || props.audienceLabel ? (
          <div className={props.sectionClassName}>
            <span className={props.sectionLabelClassName}>Properties</span>
            <div className={props.propertyGridClassName}>
              {props.hasNumericPriority && props.priorityDisplay != null ? (
                <div className={props.propCardClassName}>
                  <PriorityDisplay
                    priority = {
                      props.priorityDisplay
                    }
                    variant = {
                      'stacked'
                    }
                    showHint
                    className = {
                      props.priorityClassName
                    }
                  />
                </div>
              ) : null}
              {props.audienceLabel ? (
                <div className={props.propCardClassName}>
                  <div className={props.propLabelClassName}>Visibility</div>
                  <div className={props.propValueClassName}>{props.audienceLabel}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className={props.sectionClassName}>
          <span className={props.sectionLabelClassName}>Notes & Description</span>
          {props.displayDescription ? (
            <p className={props.detailTextClassName}>{props.displayDescription}</p>
          ) : (
            <p className={props.emptyDescriptionClassName}>
              No description provided for this item.
            </p>
          )}
        </div>

        <MetaBadges
          entries = {
            props.predefinedEntries
          }
          sectionTitle = {
            'Details / Sizing'
          }
          sectionVariant = {
            'inline'
          }
        />

        {props.userDefinedEntries.map((field) => (
          <div key={field.name} className={props.sectionClassName}>
            <span className={props.sectionLabelClassName}>{field.name}</span>
            <p className={props.detailTextClassName}>{field.value}</p>
          </div>
        ))}

        {props.showGroupFunding ? (
          <div className={props.sectionClassName}>
            <FundingWidget
              totalExtractedPrice = {
                props.totalExtractedPrice
              }
              totalClaimedAmount = {
                props.totalClaimedAmount
              }
              label = {
                'Group funding'
              }
            />
          </div>
        ) : null}

        {props.showVariationsProgress ? (
          <VariationsProgress
            variations = {
              props.variationProgress
            }
            sectionTitle = {
              'Variations'
            }
            sectionVariant = {
              'inline'
            }
          />
        ) : null}

        {props.displayItem.Links.length > 0 ? (
          <div className={props.sectionClassName}>
            <span className={props.sectionLabelClassName}>Purchase links</span>
            <LinksWidget
              links = {
                props.displayItem.Links
              }
              getSiteName = {
                props.getSiteName
              }
            />
          </div>
        ) : null}

        {props.isLinkedToItems ? (
          <RelationList
            title = {
              'Linked items'
            }
            items = {
              props.linkedRelationItems
            }
          />
        ) : null}

        {props.isRelatedToItems ? (
          <RelationList
            title = {
              'Related items'
            }
            items = {
              props.relatedRelationItems
            }
          />
        ) : null}
      </div>
    </>
  );
};
