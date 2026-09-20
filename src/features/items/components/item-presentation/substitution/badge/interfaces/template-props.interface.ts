export type TemplateProps =
  | {
      mode: 'owner-approved';
      ownerApprovedLabel: string;
      ownerClassName: string;
    }
  | {
      mode: 'user';
      counterLabel: string;
      ariaLabel: string;
      displayName: string;
      initials: string;
      createdByUserId: string | null;
      avatarClassName: string;
      avatarImageClassName: string;
      avatarInitialsClassName: string;
    };
