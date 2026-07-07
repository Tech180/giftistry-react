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

export function parseAvatarHsl(
  avatar: string | null | undefined
): { h: number; s: number; l: number } | null {
  if (!isAvatarColor(avatar)) return null;

  const match = avatar!.match(
    /^hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/i
  );
  if (!match) return null;

  return {
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const intermediate = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) {
    red = chroma;
    green = intermediate;
  } else if (h < 120) {
    red = intermediate;
    green = chroma;
  } else if (h < 180) {
    green = chroma;
    blue = intermediate;
  } else if (h < 240) {
    green = intermediate;
    blue = chroma;
  } else if (h < 300) {
    red = intermediate;
    blue = chroma;
  } else {
    red = chroma;
    blue = intermediate;
  }

  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export function hexToHsl(hex: string): string {
  const normalized = hex.replace('#', '');
  const red = parseInt(normalized.slice(0, 2), 16) / 255;
  const green = parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = ((green - blue) / delta + (green < blue ? 6 : 0)) * 60;
        break;
      case green:
        hue = ((blue - red) / delta + 2) * 60;
        break;
      default:
        hue = ((red - green) / delta + 4) * 60;
        break;
    }
  }

  return `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
}

export function avatarColorToHex(
  avatar: string | null | undefined,
  fallback = '#6366f1'
): string {
  const parsed = parseAvatarHsl(avatar);
  if (!parsed) return fallback;
  return hslToHex(parsed.h, parsed.s, parsed.l);
}
