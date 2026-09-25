import type { TourChapterId } from 'features/auth';
import type { SpotlightPlacement } from 'shared/ui';
import type { TourTargetId } from '../constants/targets.constant';

export type TourAdvanceOn = 'next' | 'target' | 'route' | 'event' | 'input';

export type TourBeforeShow =
  | 'openFab'
  | 'openDrawer'
  | 'openComments'
  | 'closeShare'
  | 'navigateDemo'
  | 'navigateDashboard'
  | 'navigateFriends'
  | 'navigateSettingsNotifications'
  | 'navigateSettingsTheming';

export interface TourStepVariant {
  target?: TourTargetId;
  placement?: SpotlightPlacement;
  beforeShow?: TourBeforeShow | TourBeforeShow[];
}

export interface TourStepDef {
  id: string;
  chapterId: TourChapterId;
  title: string;
  body: string;
  advanceOn?: TourAdvanceOn;
  /** Event name when advanceOn === 'event' */
  advanceEvent?: string;
  routeIncludes?: string;
  isDialog?: boolean;
  /** Large first-run welcome card with tutorial toggle. */
  isWelcome?: boolean;
  /** Chapter-end interstitial with Continue / exit actions. */
  isChapterEnd?: boolean;
  /** Override hands-on hint banner text. */
  hintText?: string;
  nextLabel?: string;
  skipLabel?: string;
  showBack?: boolean;
  desktop?: TourStepVariant;
  mobile?: TourStepVariant;
  /** Centered card with no target */
  center?: boolean;
  /** Demo script beat to run when step becomes active */
  demoBeat?: 'seed' | 'addItem' | 'typing' | 'comment' | 'claim';
}
