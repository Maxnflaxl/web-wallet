import { sample } from 'effector';

import WasmWallet from '@wallet';
import { setTotals, setMeta, setTransactions } from '@state/portfolio';

import { View, setView } from './shared';
import { $ready, setReady, setSyncProgress, sendWalletEvent } from './intro';
import {
  RPCEvent,
  RPCMethod,
  WalletStatus,
  SyncProgress,
  AssetsEvent,
  TxsEvent,
} from '@app/types';
import { createAddress, getWalletStatus } from '@app/api';

function handleSyncProgress(
  ready: boolean,
  { done, total, current_state_hash, tip_state_hash }: SyncProgress,
) {
  if (!ready && current_state_hash === tip_state_hash) {
    setReady(true);
    setView(View.PORTFOLIO);
    getWalletStatus();
    createAddress();
  } else {
    setSyncProgress([done, total]);
  }
}

function handleWalletStatus({ totals }: WalletStatus) {
  setTotals(totals);
}

function handleAssetsChanged({ change, assets }: AssetsEvent) {
  switch (change) {
    case 3: // reset
      setMeta(assets);
      break;
    default:
  }
}

function handleTxsChanged({ change, txs }: TxsEvent) {
  switch (change) {
    case 3: // reset
      setTransactions(txs);
      break;
    default:
  }
}

sample({
  source: $ready,
  clock: sendWalletEvent,
  fn: (ready, { id, result }) => {
    switch (id) {
      case RPCEvent.SYNC_PROGRESS:
        handleSyncProgress(ready, result);
        break;
      case RPCEvent.ASSETS_CHANGED:
        handleAssetsChanged(result);
        break;
      case RPCEvent.SYSTEM_STATE:
        getWalletStatus();
        break;
      case RPCEvent.TXS_CHANGED:
        handleTxsChanged(result);
        break;
      case RPCMethod.GetWalletStatus:
        handleWalletStatus(result);
        break;
      case RPCMethod.CreateAddress:
        break;
      default:
        break;
    }
  },
});

export const initWallet = () => {
  WasmWallet.getInstance().init(sendWalletEvent);
};
