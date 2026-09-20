import React from 'react';
import { Card } from 'shared/ui';
import { SubstitutionSwitcher } from '../item-presentation';
import { CardBody } from './components/card/card.component';
import { ClaimFooter } from './components/claim-footer/claim-footer.component';
import { Inline } from './components/inline/inline.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './showcase.module.css';

export const ShowcaseTemplate: React.FC<TemplateProps> = (props) => {
  if (props.variant === 'inline') {
    return (
      <div className={props.rootClassName}>
        <SubstitutionSwitcher
          parent = {
            props.item
          }
          options = {
            props.substitutionOptions
          }
          userId = {
            props.claimUserId
          }
          activeIndex = {
            props.substitutionActiveIndex
          }
          onActiveIndexChange = {
            props.onSubstitutionIndexChange
          }
        >
          {(active) => (
            <Inline
              displayItem = {
                props.displayItem
              }
              primaryImageUrl = {
                props.primaryImageUrl
              }
              isOwner = {
                props.isOwner
              }
              metadata = {
                props.metadata
              }
              bestPriceDisplay = {
                props.bestPriceDisplay
              }
              displayDescription = {
                props.displayDescription
              }
              predefinedEntries = {
                props.predefinedEntries
              }
              userDefinedEntries = {
                props.userDefinedEntries
              }
              showVariationsProgress = {
                props.showVariationsProgress
              }
              variationProgress = {
                props.variationProgress
              }
              showGroupFunding = {
                props.showGroupFunding
              }
              totalExtractedPrice = {
                props.totalExtractedPrice
              }
              totalClaimedAmount = {
                props.totalClaimedAmount
              }
              getSiteName = {
                props.getSiteName
              }
              substitutionKind = {
                active.kind
              }
              substitutionCreatedByUserId = {
                active.option?.CreatedByUserId
              }
              isLinkedToItems = {
                props.isLinkedToItems
              }
              isRelatedToItems = {
                props.isRelatedToItems
              }
              showHeroMeta = {
                props.showHeroMeta
              }
              showSuggestionBadge = {
                props.showSuggestionBadge
              }
              showHiddenSuggestionBadge = {
                props.showHiddenSuggestionBadge
              }
              suggestionLabel = {
                props.suggestionLabel
              }
              audienceLabel = {
                props.audienceLabel
              }
              audienceBadgeClassName = {
                props.audienceBadgeClassName
              }
              localIsFavorite = {
                props.localIsFavorite
              }
              hasNumericPriority = {
                props.hasNumericPriority
              }
              priorityDisplay = {
                props.priorityDisplay
              }
              linkedRelationItems = {
                props.linkedRelationItems
              }
              relatedRelationItems = {
                props.relatedRelationItems
              }
            />
          )}
        </SubstitutionSwitcher>
        <div className={styles['inspector-footer']}>
          <div className={styles['action-btn-row']}>
            <ClaimFooter
              {...props.claimFooter}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className = {
        props.rootClassName
      }
      padding = {
        'none'
      }
      glass = {
        true
      }
    >
      <SubstitutionSwitcher
        parent = {
          props.item
        }
        options = {
          props.substitutionOptions
        }
        userId = {
          props.claimUserId
        }
        activeIndex = {
          props.substitutionActiveIndex
        }
        onActiveIndexChange = {
          props.onSubstitutionIndexChange
        }
      >
        {(active) => (
          <CardBody
            displayItem = {
              props.displayItem
            }
            primaryImageUrl = {
              props.primaryImageUrl
            }
            metadata = {
              props.metadata
            }
            bestPriceDisplay = {
              props.bestPriceDisplay
            }
            displayDescription = {
              props.displayDescription
            }
            predefinedEntries = {
              props.predefinedEntries
            }
            userDefinedEntries = {
              props.userDefinedEntries
            }
            showVariationsProgress = {
              props.showVariationsProgress
            }
            variationProgress = {
              props.variationProgress
            }
            showGroupFunding = {
              props.showGroupFunding
            }
            totalExtractedPrice = {
              props.totalExtractedPrice
            }
            totalClaimedAmount = {
              props.totalClaimedAmount
            }
            getSiteName = {
              props.getSiteName
            }
            substitutionKind = {
              active.kind
            }
            substitutionCreatedByUserId = {
              active.option?.CreatedByUserId
            }
            isLinkedToItems = {
              props.isLinkedToItems
            }
            isRelatedToItems = {
              props.isRelatedToItems
            }
            showSuggestionBadge = {
              props.showSuggestionBadge
            }
            showHiddenSuggestionBadge = {
              props.showHiddenSuggestionBadge
            }
            suggestionLabel = {
              props.suggestionLabel
            }
            audienceLabel = {
              props.audienceLabel
            }
            audienceBadgeClassName = {
              props.audienceBadgeClassName
            }
            localIsFavorite = {
              props.localIsFavorite
            }
            displayCategory = {
              props.displayCategory
            }
            onCopyMarkdown = {
              props.onCopyMarkdown
            }
            onClose = {
              props.onClose
            }
            showQuantityProgress = {
              props.showQuantityProgress
            }
            quantityProgressMetric = {
              props.quantityProgressMetric
            }
            progressPercent = {
              props.progressPercent
            }
            claimFooter = {
              props.claimFooter
            }
          />
        )}
      </SubstitutionSwitcher>
    </Card>
  );
};
