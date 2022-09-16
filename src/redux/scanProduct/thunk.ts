import * as ACTIONS from './actions';
import type { ThunkAction } from 'redux-thunk';
import type { StateType } from '../store';
import type { ActionsType } from './reducer';
import { Buffer } from 'buffer';
import { XiphooContent } from '../../lib/XiphooContent';
import { SuccessObject } from '../../lib/SuccessObject';
import NfcManager, { Ndef, NdefRecord, NfcEvents, NfcTech, TagEvent } from 'react-native-nfc-manager';
import { Product } from '../productRegistration';
import { DefaultApi } from '../../api';
import { verifyCipher } from '../../lib/CryptoCipher';
import { block } from 'react-native-reanimated';
import { faBaseballBall } from '@fortawesome/free-solid-svg-icons';
import { Platform } from 'react-native';
import { TagFactory } from '../../tags/TagFactory'; 
import { Tag } from '../../tags/Tag';
import { NFCOperationManager } from '../../tags/NFCOperationManager';
import GetLocation, { Location } from 'react-native-get-location';
import Bugsnag from '@bugsnag/react-native';

async function cancelTechRequest() {
  try {
    console.log('Doing cancel...');
    await NfcManager.cancelTechnologyRequest();
    console.log('Done Cancel...');
  } catch { }
}

class Stopwatch {
  startTime: number | undefined;

  laps: { tag: string; milliseconds: number; msSinceLastLap: number }[] = [];

  start() {
    this.startTime = Date.now();
    this.laps = [];
  }

  lap(tag: string) {
    if (!this.startTime) throw new Error('StopWatch must be started in the firstplace');
    let ms = Date.now() - this.startTime;
    let lastMs = this.laps.length > 0 ? this.laps[this.laps.length - 1].milliseconds : 0;
    this.laps.push({
      tag,
      milliseconds: ms,
      msSinceLastLap: ms - lastMs,
    });
  }

  stop() {
    this.lap('stopped');
    this.startTime = undefined;
  }

  getLaps() {
    return this.laps;
  }
}


function timeout(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

const ios = Platform.OS == 'ios';

async function getPromiseResult<T>(p: Promise<T>): Promise<T | undefined> {
  try {
    return await p;
  } catch (error) {
    return undefined;
  }
}

interface LocationProvider{
  getLocation() : Promise<Location | undefined>
}

class DefaultLocationProvider implements LocationProvider {
  getLocation(): Promise<Location | undefined> {
    let locationPromise = GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    return locationPromise
  }

}

async function startValidationProcess(
  setScanning: (detected: boolean) => void,
  locationProvider : LocationProvider,
  location?: { latitude: number; longitude: number }, 
  tag?: TagEvent | null,
): Promise<[SuccessObject, Product | undefined, { tag: string; milliseconds: number; msSinceLastLap: number }[] | undefined]> {
  let successObject: SuccessObject = {
    offlineCheck: false,
    onlineCheck: false,
    xiphooTag: false,
    uid: '',
  };
  const sw = new Stopwatch(); 
  try {
    // if (!tag)
    await cancelTechRequest();
  } catch (error) { }
  try {
    console.log('Doing....', tag);
    if (!tag) {
      console.log('Searching for tag');
      await NFCOperationManager.requestAllSupportedTechs()
      tag = await NfcManager.getTag();
      //console.log('Connected to tag', tag); 
    } else {
      console.log('Connecting to tag'); 
      //@ts-ignore
      await NfcManager.connect([NfcTech.NfcA, NfcTech.NfcV]);
    }
    let nfcTag = TagFactory.createTag(tag)
    sw.start();

    if (!tag) throw 'Cound not read tag';
    if (!nfcTag) throw 'Cound not read NFC tag';

    successObject.uid = nfcTag.uid;
    setScanning(true);
    sw.lap('Tag read');

    let ndefMessage = tag?.ndefMessage
    //console.log('NFC: TAG', tag);
    if (tag && XiphooContent.cipherEntryExists(ndefMessage)) {
      const records = XiphooContent.getSortedRecords(ndefMessage);
      console.log('NFC: RECORDS', records);
      if (!records || records.length == 0) throw new Error('No matching tag record found!');
      var api = new DefaultApi();

      successObject.xiphooTag = true;
      sw.lap('Tag data Processed');
      for (const record of records) {
        console.log('NFC: Sart validation process ~ record', record);

        let recordBase64String = Buffer.from(record.payload).toString('base64');
        console.log('NFC: Start validation process ~ cipherValidate', recordBase64String);
        let cipherValid = verifyCipher(recordBase64String, nfcTag.uid);
        console.log('NFC: Start validation process~ cipherValid', cipherValid);
        sw.lap('Cipher validated offline');
        if (!cipherValid) continue;
        successObject.offlineCheck = true;

        console.log('NFC: Get tag info from server');
        try {
          let res: { newCipher: string; password: string } = (await api.tagUidGet({ uid: nfcTag.uid, cipher: recordBase64String })) as any;
          console.log('NFC: Tag info from server received');
          sw.lap('Cipher validated online');
          let product = undefined;
          try { 
            let { bytes, pageStart } = XiphooContent.getRecordToWrite(record, res);
            let password = [...Buffer.from(res.password, 'base64')] as [number, number, number, number]
            if (nfcTag.supportsPasswordProtection) {
              console.log('NFC: Start authenticating ...', Tag.toHexArray(password));
              let authResult = await nfcTag.authenticateForWriting(password);
              if (!authResult) {
                  console.log('NFC: Could not authenticate');
                  throw 'Cound not access tag';
              }
            } else {
              console.log("NFC: Skip authentication because tag does not support password protection")
            }

            console.log("NFC: writing payload", Tag.toHexArray(bytes))
            console.log('NFC: Writing cipher ...', res.newCipher);
            let writeResult = await nfcTag.writeUserDataRaw(pageStart + nfcTag.formatHeaderOffset(), bytes)
            console.log('NFC: Writing cipher finished', writeResult); 
            sw.lap('New Data written');
            let updatedLocation = location
            if (!location) {
               let result = await getPromiseResult(locationProvider.getLocation())
               updatedLocation = {
                longitude: result?.longitude ?? 0,
                latitude: result?.latitude ?? 0
               }
            }
            console.log("NFC: location ~ loc", updatedLocation)
            product = await api.tagUidPut({ tagUIDPutModel: { newCipher: res.newCipher, location: updatedLocation }, uid: nfcTag.uid });
            successObject.onlineCheck = true; 
          }
          catch (error) {
            console.log('NFC: ERROR:', error);
            product = await api.tagUidGet({ uid: nfcTag.uid, cipher: recordBase64String, readOnly: true })
            successObject.onlineCheck = false;
          } 

          sw.lap('New Data confirmed online');

          setScanning(false);

          return [successObject, product as any, sw.getLaps()];
        } catch (error) {
          console.log('NFC: ERROR:', error);
          if (error == 'transceive fail') throw 10;
        }
      }
    } else {
      console.log('NFC: no Cipher entry found');
    }
  } catch (ex) {
    console.log('Exception', ex);
    if (ex === 10) throw new TagWriteError('Write to tag Failed... please try again and do not remove your phone.');
    if (ex == 'cancelled') throw ex;
    throw new Error('Scanning failed!');
  } finally {
    setScanning(false);
  }
  console.log('RETURNING', successObject);
  return [successObject, undefined, undefined];
}

class TagWriteError extends Error {
  type = 'TagWriteError';
  constructor(message: string) {
    super(message);
  }
}

export const startScanningAtLaunch = (): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  console.log('🚀 ~ file: thunk.ts ~ line 330 ~ startScanningAtLaunch ~ startScanningAtLaunch');

  try {
    dispatch(ACTIONS.setInProgressAction(true));
    const tag = await NfcManager.getLaunchTagEvent();
    if (tag != null) {
      const cb = (detected: boolean) => {
        if (detected) {
          dispatch(ACTIONS.startScanningRequestAction());
        }
        dispatch(ACTIONS.tagDetectedAction(detected));
      };
      let [res, product, laps] = await startValidationProcess(cb, tag, new DefaultLocationProvider(), getState().settings.settings.location);

      dispatch(ACTIONS.startScanningSuccessAction(res, product, laps));
    }
  } catch (error) {
    dispatch(ACTIONS.startScanningFailureAction(error));
  } finally {
    dispatch(ACTIONS.setInProgressAction(false));
    dispatch(startScanning());
  }
};

export const startScanningAndroid = (): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  const blocking = getState().scanProduct.fetching.inProgress;
  if (blocking) return;
  try {
    dispatch(ACTIONS.setInProgressAction(true));
    console.log('starting scanning...');
    await NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag: any) => {
      try {
        console.log('tag detected');
        const cb = (detected: boolean) => {
          if (detected) {
            dispatch(ACTIONS.startScanningRequestAction());
          }
          dispatch(ACTIONS.tagDetectedAction(detected));
        };
        let [res, product, laps] = await startValidationProcess(cb, new DefaultLocationProvider(), getState().settings.settings.location, tag);

        dispatch(ACTIONS.startScanningSuccessAction(res, product, laps));
      } catch (error) {
        if (error == 'cancelled') {
          dispatch(ACTIONS.resetActionSoft());
        } else dispatch(ACTIONS.startScanningFailureAction(error));
      }
    });
  } catch (error) {
    dispatch(ACTIONS.startScanningFailureAction(error));
  }
};

export const startScanning = (): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  const blocking = getState().scanProduct.fetching.inProgress;
  try {
    console.log('🚀 ~ file: thunk.ts ~ line 271 ~ startScanning ~ blocker.blocking', blocking);
    if (blocking) return;
    dispatch(ACTIONS.setInProgressAction(true));
    console.log('starting scanning...');
    // dispatch(ACTIONS.startScanningRequestAction());
    await NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag: any) => { });
    while (true) {
      try {
        console.log('in loop...');
        const cb = (detected: boolean) => {
          if (detected) {
            dispatch(ACTIONS.startScanningRequestAction());
          }
          dispatch(ACTIONS.tagDetectedAction(detected));
        };
        let [res, product, laps] = await startValidationProcess(cb, new DefaultLocationProvider(), getState().settings.settings.location, undefined);

        dispatch(ACTIONS.startScanningSuccessAction(res, product, laps));
      } catch (error) {
        console.log('🚀 ~ file: thunk.ts ~ line 290 ~ startScanning ~ error', error);

        if (error == 'cancelled') {
          console.log('Errors is cancelled');
          throw 'soft';
        } else dispatch(ACTIONS.startScanningFailureAction(error));
      } finally {
        // await cancelTechRequest();
        // await timeout(50)
      }
    }
  } catch (error) {
    console.log('🚀 ~ file: thunk.ts ~ line 275 ~ startScanning ~ error == "soft"', error == 'soft', error);
    if (error == 'soft') dispatch(ACTIONS.resetActionSoft());
    else dispatch(ACTIONS.startScanningFailureAction(error));
  } finally {
    dispatch(ACTIONS.setInProgressAction(false));
  }
};

export const startScanningIOS = (): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  const blocking = getState().scanProduct.fetching.inProgress;
  try {
    console.log('🚀 ~ file: thunk.ts ~ line 271 ~ startScanning ~ blocker.blocking', blocking);
    if (blocking) return;
    dispatch(ACTIONS.setInProgressAction(true));
    console.log('starting scanning...');
    // dispatch(ACTIONS.startScanningRequestAction());
    await NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag: any) => { });
    const cb = (detected: boolean) => {
      if (detected) {
        dispatch(ACTIONS.startScanningRequestAction());
      }
      dispatch(ACTIONS.tagDetectedAction(detected));
    };
    let [res, product, laps] = await startValidationProcess(cb, new DefaultLocationProvider(), getState().settings.settings.location, undefined);

    dispatch(ACTIONS.startScanningSuccessAction(res, product, laps));
  } catch (error) {
    console.log('🚀 ~ file: thunk.ts ~ line 275 ~ startScanning ~ error == "soft"', error == 'soft', error);
    if (error == 'soft') dispatch(ACTIONS.resetActionSoft());
    else dispatch(ACTIONS.startScanningFailureAction(error));
  } finally {
    dispatch(ACTIONS.setInProgressAction(false));
    cancelTechRequest()
  }
};


