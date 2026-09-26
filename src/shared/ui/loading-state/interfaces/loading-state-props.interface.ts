export interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  /** Full-viewport wait outside AppShell (boot / setup). */
  viewport?: boolean;
  className?: string;
}
