import type { CSSProperties } from 'react';

export function generateAvatarColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 60;
  const l = Math.floor(Math.random() * 20) + 35;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function isAvatarColor(avatar: string | null | undefined): boolean {
  return !!avatar && avatar.startsWith('hsl');
}

export function isAvatarImage(avatar: string | null | undefined): boolean {
  return !!avatar && !isAvatarColor(avatar);
}

export function getAvatarStyle(avatar: string | null | undefined): CSSProperties {
  if (isAvatarImage(avatar)) {
    const safeUrl = avatar!.replace(/"/g, '\\"');
    return {
      background: 'transparent',
      backgroundImage: `url("${safeUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (isAvatarColor(avatar)) {
    return {
      background: avatar as string,
      backgroundImage: 'none',
    };
  }

  return {
    background: 'var(--primary)',
    backgroundImage: 'none',
  };
}

export function shouldShowAvatarInitials(avatar: string | null | undefined): boolean {
  return !avatar || isAvatarColor(avatar);
}
