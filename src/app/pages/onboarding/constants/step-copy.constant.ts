import type { StepId } from '../interfaces/step-id.type';

export const STEP_COPY: Record<StepId, { title: string; subtitle: string }> = {
  hello: {
    title: 'Welcome to Giftistry',
    subtitle: "Let's get you settled in — it only takes a minute.",
  },
  theme: {
    title: 'Pick your look',
    subtitle: 'Choose a theme that feels like home. You can change it anytime.',
  },
  profile: {
    title: 'Introduce yourself',
    subtitle: 'A name (and optional bio) so friends know who you are.',
  },
  public_url: {
    title: 'Public URL',
    subtitle: 'Where this Giftistry instance lives on the web.',
  },
  registration: {
    title: 'Who can join',
    subtitle: 'Decide how new people create accounts.',
  },
  mail: {
    title: 'Email delivery',
    subtitle: 'How Giftistry sends invites and notifications.',
  },
  ai: {
    title: 'AI features',
    subtitle: 'Optional helpers for gift ideas and product lookup.',
  },
  done: {
    title: "You're ready",
    subtitle: 'Your space is set — time to start sharing wishlists.',
  },
};
