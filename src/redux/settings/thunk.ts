import * as ACTIONS from './actions';
import type { ThunkAction } from 'redux-thunk';
import type { StateType } from '../store';
import type { ActionsType, SettingsType } from './reducer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ZebraScanner from 'react-native-zebra-scanner';
import GetLocation from 'react-native-get-location';

export const loadSettings = (): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  try {
    dispatch(ACTIONS.loadSettingsRequestAction());
    let zebraPromise = ZebraScanner.isAvailable();
    let locationPromise = GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });

    let settings: SettingsType;
    try {
      let res = await AsyncStorage.getItem('settings');
      if (res !== null) {
        settings = JSON.parse(res);
        settings.hasDedicatedScannerHardware = await zebraPromise;
        settings.locationPromise = locationPromise;
      } else throw new Error();
    } catch (error) {
      settings = {
        autoBarcodeRead: false,
        audioWarnings: false,
        autoWrite: false,
        hasDedicatedScannerHardware: await zebraPromise,
        locationPromise
      };
    }

    dispatch(ACTIONS.loadSettingsSuccessAction(settings));
    try {
      const location = await locationPromise;
      settings.location = { longitude: location.longitude, latitude: location.latitude };
    } catch (error) {
      //console.log(error)
    }

    dispatch(ACTIONS.loadSettingsSuccessAction(settings));
  } catch (error) {
    dispatch(ACTIONS.loadSettingsFailureAction(error));
  }
};

export const updateSettings = (settings: Partial<SettingsType>): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
  try {
    dispatch(ACTIONS.updateSettingsRequestAction());
    const updatedSettings = { ...getState().settings.settings, ...settings };
    await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    dispatch(ACTIONS.updateSettingsSuccessAction(updatedSettings));
    //console.log('🚀 ~ file: thunk.ts ~ line 42 ~ updateSettings ~ updatedSettings', updatedSettings);
  } catch (error) {
    //console.log('🚀 ~ file: thunk.ts ~ line 43 ~ updateSettings ~ error', error);
    dispatch(ACTIONS.updateSettingsFailureAction(error));
  }
};

