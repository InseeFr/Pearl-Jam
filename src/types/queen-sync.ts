/**
 * Queen synchronization result data structure
 * This matches the actual data format returned by the Queen app
 */
export interface QueenSyncResult {
  /** Whether an error occurred during Queen synchronization */
  error: boolean;

  /** Optional error message if synchronization failed */
  errorMessage?: string;

  /** List of successfully synchronized interrogations */
  interrogationsSuccess: string[];

  /** List of interrogations in temporary zone */
  interrogationsInTempZone: string[];
}