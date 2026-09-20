export interface Props {
  avatar?: string | null;
  alt: string;
  initials: string;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
}

/** @deprecated Prefer `Props`; kept for barrel consumers. */
export type UserAvatarProps = Props;
