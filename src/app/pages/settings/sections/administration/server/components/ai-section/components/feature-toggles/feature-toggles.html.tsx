import React from 'react';
import { Globe, Shield, Layers, Sparkles } from 'lucide-react';
import { Switch, NumberSelector, SelectMenu } from 'shared/ui';
import { AI_METADATA_EXTRACTION_PRESET_OPTIONS } from 'features/system/constants/ai-metadata-extraction-preset-options.constant';
import type { FeatureTogglesTemplateProps } from './interfaces/template-props.interface';
import styles from './feature-toggles.module.css';

export const FeatureTogglesTemplate: React.FC<FeatureTogglesTemplateProps> = ({
  aiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiImportChunkingEnabled,
  setAiImportChunkingEnabled,
  aiImportChunkItemLimit,
  setAiImportChunkItemLimit,
  aiMetadataExtractionPreset,
  setAiMetadataExtractionPreset,
  aiPageContextMaxChars,
  setAiPageContextMaxChars,
  aiPopulateMaxTokens,
  setAiPopulateMaxTokens,
  aiMetadataSplitPackCalls,
  setAiMetadataSplitPackCalls,
  selectedPresetDescription,
}) => (
  <div className={styles['feature-toggles']}>
    <div className={styles['feature-toggles__card']}>
      <div className={styles['feature-toggles__card-header']}>
        <div className={styles['feature-toggles__header-left']}>
          <div className={styles['feature-toggles__icon']} aria-hidden="true">
            <Globe size={16} className={styles['feature-toggles__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['feature-toggles__title']}>Web search</h3>
            <p className={styles['feature-toggles__subtitle']}>
              Allow AI providers with search capability to fetch live web data.
            </p>
          </div>
        </div>
        <Switch
          checked = {
            aiWebSearchEnabled
          }
          onChange = {
            setAiWebSearchEnabled
          }
          disabled = {
            !aiEnabled
          }
          aria-label = {
            'Enable AI web search'
          }
        />
      </div>
    </div>

    <div className={styles['feature-toggles__card']}>
      <div className={styles['feature-toggles__card-header']}>
        <div className={styles['feature-toggles__header-left']}>
          <div className={styles['feature-toggles__icon']} aria-hidden="true">
            <Shield size={16} className={styles['feature-toggles__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['feature-toggles__title']}>Rate limiting</h3>
            <p className={styles['feature-toggles__subtitle']}>
              Limit AI request frequency to protect provider quotas and local resources.
            </p>
          </div>
        </div>
        <Switch
          checked = {
            aiRateLimitEnabled
          }
          onChange = {
            setAiRateLimitEnabled
          }
          disabled = {
            !aiEnabled
          }
          aria-label = {
            'Enable AI rate limiting'
          }
        />
      </div>
    </div>

    <div className={styles['feature-toggles__card']}>
      <div className={styles['feature-toggles__card-header']}>
        <div className={styles['feature-toggles__header-left']}>
          <div className={styles['feature-toggles__icon']} aria-hidden="true">
            <Layers size={16} className={styles['feature-toggles__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['feature-toggles__title']}>Import chunking</h3>
            <p className={styles['feature-toggles__subtitle']}>
              Split large wishlist imports into smaller AI requests for more reliable extraction.
            </p>
          </div>
        </div>
        <Switch
          checked = {
            aiImportChunkingEnabled
          }
          onChange = {
            setAiImportChunkingEnabled
          }
          disabled = {
            !aiEnabled
          }
          aria-label = {
            'Enable AI import chunking'
          }
        />
      </div>

      {aiImportChunkingEnabled ? (
        <div className={styles['feature-toggles__body']}>
          <div className={styles['feature-toggles__field-row']}>
            <div className={styles['feature-toggles__field-info']}>
              <label className={styles['feature-toggles__label']}>Items per import chunk</label>
              <p className={styles['feature-toggles__hint']}>
                Maximum candidate rows sent to the AI in each import chunk (1–100).
              </p>
            </div>
            <NumberSelector
              value = {
                aiImportChunkItemLimit
              }
              min = {
                1
              }
              max = {
                100
              }
              onChange = {
                setAiImportChunkItemLimit
              }
              disabled = {
                !aiEnabled
              }
              editLabel = {
                'Items per AI import chunk'
              }
              decreaseLabel = {
                'Decrease items per AI import chunk'
              }
              increaseLabel = {
                'Increase items per AI import chunk'
              }
            />
          </div>
        </div>
      ) : null}
    </div>

    <div className={styles['feature-toggles__card']}>
      <div className={styles['feature-toggles__card-header']}>
        <div className={styles['feature-toggles__header-left']}>
          <div className={styles['feature-toggles__icon']} aria-hidden="true">
            <Sparkles size={16} className={styles['feature-toggles__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['feature-toggles__title']}>Metadata extraction</h3>
            <p className={styles['feature-toggles__subtitle']}>
              Choose how product populate prompts are sized and split. Use Fast or Thorough with
              small local models; Balanced is a good default for most setups.
            </p>
          </div>
        </div>
      </div>

      <div className={styles['feature-toggles__body']}>
        <div className={styles['feature-toggles__field']}>
          <label className={styles['feature-toggles__label']} htmlFor="ai-metadata-extraction-preset">
            Extraction preset
          </label>
          <SelectMenu
            id = {
              'ai-metadata-extraction-preset'
            }
            className = {
              styles['feature-toggles__select']
            }
            value = {
              aiMetadataExtractionPreset
            }
            options = {
              AI_METADATA_EXTRACTION_PRESET_OPTIONS
            }
            onChange = {
              setAiMetadataExtractionPreset
            }
            variant = {
              'field'
            }
            menuTitle = {
              'Extraction preset'
            }
            disabled = {
              !aiEnabled
            }
            aria-label = {
              'AI metadata extraction preset'
            }
          />
          {selectedPresetDescription ? (
            <p className={styles['feature-toggles__hint']}>{selectedPresetDescription}</p>
          ) : null}
        </div>

        <div className={styles['feature-toggles__section-divider']} />

        <div className={styles['feature-toggles__sub-section']}>
          <div className={styles['feature-toggles__sub-header']}>
            <h4 className={styles['feature-toggles__sub-title']}>Advanced extraction limits</h4>
            <p className={styles['feature-toggles__hint']}>
              Optional token caps and execution tuning. Set to 0 to use preset defaults.
            </p>
          </div>

          <div className={styles['feature-toggles__limits-list']}>
            <div className={styles['feature-toggles__field-row']}>
              <div className={styles['feature-toggles__field-info']}>
                <label className={styles['feature-toggles__label']}>
                  Max page context characters
                </label>
                <p className={styles['feature-toggles__hint']}>
                  0 uses the preset default (Full = no cap). Overrides apply to categorize and
                  populate.
                </p>
              </div>
              <NumberSelector
                value = {
                  aiPageContextMaxChars
                }
                min = {
                  0
                }
                max = {
                  50000
                }
                onChange = {
                  setAiPageContextMaxChars
                }
                disabled = {
                  !aiEnabled
                }
                editLabel = {
                  'Max AI page context characters'
                }
                decreaseLabel = {
                  'Decrease max AI page context characters'
                }
                increaseLabel = {
                  'Increase max AI page context characters'
                }
              />
            </div>

            <div className={styles['feature-toggles__field-row']}>
              <div className={styles['feature-toggles__field-info']}>
                <label className={styles['feature-toggles__label']}>Max populate output tokens</label>
                <p className={styles['feature-toggles__hint']}>
                  0 uses the preset default (Full omits the limit). Applied per populate AI call.
                </p>
              </div>
              <NumberSelector
                value = {
                  aiPopulateMaxTokens
                }
                min = {
                  0
                }
                max = {
                  16384
                }
                onChange = {
                  setAiPopulateMaxTokens
                }
                disabled = {
                  !aiEnabled
                }
                editLabel = {
                  'Max AI populate output tokens'
                }
                decreaseLabel = {
                  'Decrease max AI populate output tokens'
                }
                increaseLabel = {
                  'Increase max AI populate output tokens'
                }
              />
            </div>
          </div>

          <div
            className = {
              [
                styles['feature-toggles__nested-row'],
                !aiEnabled || aiMetadataExtractionPreset !== 'thorough'
                  ? styles['feature-toggles__nested-row--disabled']
                  : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            <div className={styles['feature-toggles__nested-info']}>
              <h4 className={styles['feature-toggles__nested-title']}>
                Separate call per metadata pack
              </h4>
              <p className={styles['feature-toggles__hint']}>
                Only applies when preset is Thorough. Runs one AI call per active pack after the
                core fields call.
              </p>
            </div>
            <Switch
              checked = {
                aiMetadataSplitPackCalls
              }
              onChange = {
                setAiMetadataSplitPackCalls
              }
              disabled = {
                !aiEnabled || aiMetadataExtractionPreset !== 'thorough'
              }
              aria-label = {
                'Separate AI call per metadata pack'
              }
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeatureTogglesTemplate;
