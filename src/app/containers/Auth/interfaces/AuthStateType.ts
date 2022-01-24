import { SyncProgress } from './SyncProgress';

export interface AuthStateType {
  is_wallet_synced: boolean;
  sync_progress: SyncProgress;
  database_sync_progress: {
    done: number;
    total: number;
  };
  seed_values: (string | null)[];
  seed_errors: (boolean | null)[];
  seed_result: string | null;
  registration_seed: string;
  is_restore: boolean;
  seed_ids: number[];
}
