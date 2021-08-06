export enum RPCMethod {
  ToggleSubscribeTo = 'ev_subunsub',
  GetAssetInfo = 'get_asset_info',
  GetWalletStatus = 'wallet_status',
  GetAddressList = 'addr_list',
  GetUTXO = 'get_utxo',
  GetTXList = 'tx_list',
  CreateAddress = 'create_address',
}

export enum RPCEvent {
  SYNC_PROGRESS = 'ev_sync_progress',
  ASSETS_CHANGED = 'ev_assets_changed',
  SYSTEM_STATE = 'ev_system_state',
  TXS_CHANGED = 'ev_txs_changed',
}
export interface ToggleSubscribeToParams {
  ev_sync_progress?: boolean;
  ev_system_state?: boolean;
  ev_assets_changed?: boolean;
  ev_addrs_changed?: boolean;
  ev_utxos_changed?: boolean;
  ev_txs_changed?: boolean;
}

// data

export interface SyncHash {
  is_in_sync: boolean;
  prev_state_hash: string;
  current_height: number;
  current_state_hash: string;
  current_state_timestamp: number;
}

export interface WalletTotal {
  asset_id: number;
  available: number;
  available_str: string;
  maturing: number;
  maturing_str: string;
  receiving: number;
  receiving_str: string;
  sending: number;
}

export interface MetadataPairs {
  N: string;
  NTHUN?: string;
  SCH_VER?: string;
  SN: string;
  UN?: string;
}

export interface Asset {
  asset_id: number;
  emission: number;
  emission_str: string;
  isOwned: number;
  lockHeight: number;
  metadata: string;
  metadata_kv: boolean;
  metadata_pairs: MetadataPairs;
  metadata_std: boolean;
  metadata_std_min: boolean;
  ownerId: string;
}

export interface SyncProgress extends SyncHash {
  done: number;
  total: number;
  tip_height: number;
  tip_prev_state_hash: string;
  tip_state_hash: string;
  tip_state_timestamp: number;
}

export interface WalletStatus extends SyncHash {
  available: number;
  difficulty: number;
  maturing: number;
  receiving: number;
  totals: WalletTotal[];
}

// events

export interface Transaction {
  asset_id: number;
  comment: string;
  confirmations: number;
  create_time: number;
  fee: number;
  height: number;
  income: boolean;
  kernel: string;
  receiver: string;
  sender: string;
  status: number;
  status_string: string;
  txId: string;
  tx_type: number;
  tx_type_string: string;
  value: number;
}

export interface ChangeEvent {
  change: number;
  change_str: string;
}
export interface AssetsEvent extends ChangeEvent {
  assets: Asset[];
}

export interface TxsEvent extends ChangeEvent {
  txs: Transaction[];
}
