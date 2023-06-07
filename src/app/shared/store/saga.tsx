import {
  call, take, fork, takeLatest, put,
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { walletLocked } from '@core/api';
import {
  BackgroundEvent, RemoteResponse, RPCEvent, Environment,
} from '@core/types';

import {
  handleConnect,
  handleDatabaseRestore,
  handleDatabaseSyncProgress,
  handleProgress,
  handleSyncStep,
  handleUnlockWallet,
} from '@app/containers/Auth/store/saga';
import { handleTotals, handleAssets } from '@app/containers/Wallet/store/saga';
import { handleTransactions } from '@app/containers/Transactions/store/saga';
import { actions } from '@app/shared/store/index';
import { navigate } from '@app/shared/store/actions';
import { ROUTES } from '@app/shared/constants';
import NotificationController from '@app/core/NotificationController';
import NotificationManager from '@app/core/NotificationManager';
import ExtensionPlatform from '@app/core/Extension';
import * as extensionizer from 'extensionizer';

import WasmWallet from '@core/WasmWallet';

const wallet = WasmWallet.getInstance();
const notificationManager = NotificationManager.getInstance();

export function remoteEventChannel() {
  return eventChannel((emitter) => {
    const handler = (data: RemoteResponse) => {
      emitter(data);
    };

    const platform = new ExtensionPlatform();

    if (platform.getEnvironmentType() === 'notification') {
      const backgroundPort = extensionizer.runtime.connect({
        name: Environment.NOTIFICATION,
      });

      notificationManager.setReqPort(backgroundPort); // TODO
      backgroundPort.onMessage.addListener(({ isRunning, notification }) => {
        wallet.init(handler, notification, isRunning);
      });
    } else {
      wallet.init(handler, null);
    }

    const unsubscribe = () => {
      emitter(END);
    };

    return unsubscribe;
  });
}

function* lockWallet() {
  localStorage.setItem('locked', '1');
  walletLocked();
  yield put(navigate(ROUTES.AUTH.LOGIN));
}

function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  yield takeLatest(actions.lockWallet, lockWallet);
  while (true) {
    try {
      // An error from socketChannel will cause the saga jump to the catch block
      const payload: RemoteResponse = yield take(remoteChannel);
      switch (payload.id) {
        case BackgroundEvent.CONNECTED:
          yield fork(handleConnect, payload.result);
          break;

        case BackgroundEvent.UNLOCK_WALLET:
          yield fork(handleUnlockWallet, payload.result);
          break;

        case BackgroundEvent.CHANGE_SYNC_STEP:
          yield fork(handleSyncStep, payload.result);

          break;
        case BackgroundEvent.DOWNLOAD_DB_PROGRESS:
          yield fork(handleDatabaseSyncProgress, payload.result);

          break;
        case BackgroundEvent.RESTORE_DB_PROGRESS:
          yield fork(handleDatabaseRestore, payload.result);
          break;

        case BackgroundEvent.CLOSE_NOTIFICATION:
          if (NotificationController.getNotification()) {
            window.close();
          }
          break;

        case RPCEvent.SYNC_PROGRESS:
          yield fork(handleProgress, payload.result);
          break;

        case RPCEvent.ASSETS_CHANGED:
          yield fork(handleAssets, payload.result);
          break;

        case RPCEvent.SYSTEM_STATE:
          yield fork(handleTotals);
          break;

        case RPCEvent.TXS_CHANGED:
          yield fork(handleTransactions, payload.result);
          break;

        default:
          //  console.log('remoteChannel', payload);
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;