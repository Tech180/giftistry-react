export interface ConnectorProps {
  /** Previous step is done (or current is past) — solid filled line. */
  filled: boolean;
  /** Active flow animation on the segment. */
  active: boolean;
  /** Final step has no outgoing connector. */
  isLast: boolean;
}
