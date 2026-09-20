import React from 'react';
import type { ModelPickerTemplateProps } from './interfaces/template-props.interface';
import styles from './model-picker.module.css';

export const ModelPickerTemplate: React.FC<ModelPickerTemplateProps> = ({
  slot,
  helper,
  model,
  setModel,
  selectedCompany,
  filteredModels,
  localModelMode,
  slotLocalModels,
  isLocalProvider,
  aiEnabled,
  isLoadingModels,
  companies,
  localModelSelectDisabled,
  isTestingAiConnection,
  localModelSelectValue,
  customModelValue,
  selectId,
  inputId,
  companyId,
  showLocalSelect,
  showLocalInput,
  localSelectFullWidth,
  onCompanyChange,
  onLocalModelSelection,
}) => {
  if (!isLocalProvider) {
    return (
      <div className={styles['model-picker']}>
        <div className={styles['model-picker__row']}>
          <div className={styles['model-picker__group']}>
            <label className={styles['model-picker__label']} htmlFor={companyId}>
              Company
            </label>
            <div className={styles['model-picker__select-box']}>
              <select
                id={companyId}
                className={`${styles['model-picker__input']} ${styles['model-picker__select']}`}
                value={selectedCompany}
                onChange={(e) => onCompanyChange(e.target.value)}
                disabled={isLoadingModels}
                aria-label="Company"
              >
                {isLoadingModels ? (
                  <option value="">Loading companies...</option>
                ) : (
                  <>
                    <option value="">Select a company...</option>
                    {companies.map((company) => (
                      <option key={`${slot}-${company}`} value={company}>
                        {company}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className={styles['model-picker__group']}>
            <label className={styles['model-picker__label']} htmlFor={selectId}>
              Model
            </label>
            <div className={styles['model-picker__select-box']}>
              <select
                id={selectId}
                className={`${styles['model-picker__input']} ${styles['model-picker__select']}`}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required={aiEnabled}
                disabled={isLoadingModels || !selectedCompany}
                aria-label="Model"
              >
                {isLoadingModels ? (
                  <option value="">Loading models...</option>
                ) : !selectedCompany ? (
                  <option value="">Select a company first...</option>
                ) : (
                  <>
                    <option value="">Select a model...</option>
                    {filteredModels.map((modelItem) => (
                      <option key={modelItem.id} value={modelItem.id}>
                        {modelItem.displayName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
        <span className={styles['model-picker__help']}>{helper}</span>
      </div>
    );
  }

  return (
    <div className={styles['model-picker']}>
      <label
        className={styles['model-picker__label']}
        htmlFor={showLocalSelect && localModelMode === 'listed' ? selectId : inputId}
      >
        Model
      </label>
      <div className={styles['model-picker__local-row']}>
        {showLocalSelect ? (
          <div
            className={`${styles['model-picker__select-box']} ${styles['model-picker__select-box--in-row']} ${
              localSelectFullWidth ? styles['model-picker__select-box--full'] : ''
            }`}
          >
            <select
              id={selectId}
              className={`${styles['model-picker__input']} ${styles['model-picker__input--in-row']} ${styles['model-picker__select']}`}
              value={localModelSelectValue}
              onChange={(e) => onLocalModelSelection(slot, e.target.value)}
              disabled={localModelSelectDisabled}
              aria-label="Discovered models"
            >
              {isTestingAiConnection ? (
                <option value={customModelValue}>Discovering models…</option>
              ) : (
                <>
                  {slotLocalModels.map((modelId) => (
                    <option key={`${slot}-${modelId}`} value={modelId}>
                      {modelId}
                    </option>
                  ))}
                  <option value={customModelValue}>Custom model…</option>
                </>
              )}
            </select>
          </div>
        ) : null}
        {showLocalInput ? (
          <input
            type="text"
            id={inputId}
            className={`${styles['model-picker__input']} ${styles['model-picker__input--in-row']}`}
            placeholder="llama3"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isTestingAiConnection}
            aria-label="Model"
          />
        ) : null}
      </div>
      <span className={styles['model-picker__help']}>{helper}</span>
    </div>
  );
};

export default ModelPickerTemplate;
