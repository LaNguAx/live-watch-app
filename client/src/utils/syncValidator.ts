/**
 * Video Synchronization Validator
 *
 * This utility helps maintain video sync across all users by:
 * 1. Detecting when sync is lost
 * 2. Requesting re-sync from server when needed
 * 3. Validating sync state consistency
 */

export interface SyncState {
  currentTime: number;
  isPlaying: boolean;
  videoId: string;
  lastUpdateTime: number;
}

export interface SyncValidationResult {
  isInSync: boolean;
  timeDrift: number;
  needsResync: boolean;
  reason?: string;
}

export class SyncValidator {
  private tolerance: number;
  private maxDriftBeforeResync: number;
  private lastSyncCheck: number;

  constructor(tolerance = 1, maxDriftBeforeResync = 3) {
    this.tolerance = tolerance; // seconds
    this.maxDriftBeforeResync = maxDriftBeforeResync; // seconds
    this.lastSyncCheck = Date.now();
  }

  /**
   * Validates if the local video state is in sync with the expected state
   */
  validateSync(
    localState: SyncState,
    expectedState: SyncState
  ): SyncValidationResult {
    // Different video = definitely needs resync
    if (localState.videoId !== expectedState.videoId) {
      return {
        isInSync: false,
        timeDrift: 0,
        needsResync: true,
        reason: 'Different video loaded',
      };
    }

    // Calculate expected current time based on elapsed time
    const now = Date.now();
    const timeSinceLastUpdate = (now - expectedState.lastUpdateTime) / 1000;
    const expectedCurrentTime = expectedState.isPlaying
      ? expectedState.currentTime + timeSinceLastUpdate
      : expectedState.currentTime;

    const timeDrift = Math.abs(localState.currentTime - expectedCurrentTime);

    // Check playing state sync
    if (localState.isPlaying !== expectedState.isPlaying) {
      return {
        isInSync: false,
        timeDrift,
        needsResync: true,
        reason: `Play state mismatch: local=${localState.isPlaying}, expected=${expectedState.isPlaying}`,
      };
    }

    // Check time drift
    const isInSync = timeDrift <= this.tolerance;
    const needsResync = timeDrift > this.maxDriftBeforeResync;

    return {
      isInSync,
      timeDrift,
      needsResync,
      reason: needsResync
        ? `Time drift too large: ${timeDrift.toFixed(2)}s`
        : undefined,
    };
  }

  /**
   * Determines if it's time to perform a sync check
   */
  shouldPerformSyncCheck(intervalMs = 5000): boolean {
    const now = Date.now();
    if (now - this.lastSyncCheck >= intervalMs) {
      this.lastSyncCheck = now;
      return true;
    }
    return false;
  }

  /**
   * Calculates the adjusted time accounting for network delay
   */
  calculateAdjustedTime(
    serverTime: number,
    serverTimestamp: number,
    isPlaying: boolean
  ): number {
    if (!isPlaying) return serverTime;

    const networkDelay = (Date.now() - serverTimestamp) / 1000;
    return serverTime + networkDelay;
  }

  /**
   * Updates tolerance settings
   */
  updateSettings(tolerance?: number, maxDriftBeforeResync?: number) {
    if (tolerance !== undefined) this.tolerance = tolerance;
    if (maxDriftBeforeResync !== undefined)
      this.maxDriftBeforeResync = maxDriftBeforeResync;
  }
}

export const syncValidator = new SyncValidator();
