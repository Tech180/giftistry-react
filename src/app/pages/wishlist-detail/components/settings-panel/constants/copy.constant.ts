import type { RowCopy } from '../interfaces/row-copy.interface';

export const META_ON = 'On';
export const META_OFF = 'Off';
export const PANEL_ARIA_LABEL = 'List settings';

export const GROUP_FUNDING_COPY: RowCopy = {
  label: 'Group Funding',
  viewOn: 'Group funding is on for this list',
  viewOff: 'Group funding is off for this list',
  editEnable: 'Group funding disabled for this list. Click to enable.',
  editDisable: 'Group funding enabled for this list. Click to disable.',
  switchEnable: 'Enable group funding',
  switchDisable: 'Disable group funding',
};

export const ROLLOVER_COPY: RowCopy = {
  label: 'Rollover',
  viewOn: 'Auto rollover is on for this list',
  viewOff: 'Auto rollover is off for this list',
  editEnable: 'Auto rollover disabled for this list. Click to enable.',
  editDisable: 'Auto rollover enabled for this list. Click to disable.',
  switchEnable: 'Enable rollover',
  switchDisable: 'Disable rollover',
};

export const AI_COPY: RowCopy = {
  label: 'AI',
  viewOn: 'AI is on for this list',
  viewOff: 'AI is off for this list',
  editEnable: 'AI disabled for this list. Click to enable.',
  editDisable: 'AI enabled for this list. Click to disable.',
  switchEnable: 'Enable AI',
  switchDisable: 'Disable AI',
};

export const WEB_SEARCH_COPY: RowCopy = {
  label: 'Web search',
  viewOn: 'Web search is on for this list',
  viewOff: 'Web search is off for this list',
  editEnable: 'Web search disabled for this list. Click to enable.',
  editDisable: 'Web search enabled for this list. Click to disable.',
  switchEnable: 'Enable web search',
  switchDisable: 'Disable web search',
};

export const BACKGROUND_ENRICH_COPY: RowCopy = {
  label: 'Background enrich',
  viewOn: 'Background enrich is on for this list',
  viewOff: 'Background enrich is off for this list',
  editEnable: 'Background enrich disabled for this list. Click to enable.',
  editDisable: 'Background enrich enabled for this list. Click to disable.',
  switchEnable: 'Enable background enrich',
  switchDisable: 'Disable background enrich',
};
