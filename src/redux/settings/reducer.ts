import GetLocation from 'react-native-get-location';
import * as ACTION_TYPES from './types';
import type * as ACTIONS from './actions';
import { FetchingType, createDefault, createFetching, createSuccess, createError } from '../common';

type ValueOf<T> = T[keyof T];
export type ActionsType = ValueOf<{ [k in keyof typeof ACTIONS]: ReturnType<typeof ACTIONS[k]> }>;

export type SettingsType = {
  audioWarnings: boolean;
  autoBarcodeRead: boolean;
  autoWrite: boolean;
  hasDedicatedScannerHardware: boolean;
  location?: { longitude: number, latitude: number }
  locationPromise?: Promise<{ longitude: number, latitude: number }>
};

export type initialStateType = {
  fetching: {
    loadSettings: FetchingType;
    updateSettings: FetchingType;
  };
  settings: SettingsType;
};

const initialState: initialStateType = {
  fetching: {
    loadSettings: createDefault(),
    updateSettings: createDefault(),
  },
  settings: {
    autoBarcodeRead: false,
    audioWarnings: false,
    autoWrite: false,
    hasDedicatedScannerHardware: true,
    locationPromise: GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
  },
};

export const settingsReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
  switch (action.type) {
    case ACTION_TYPES.ADD_LOCATION_PROMISE: return { ...state }
    case ACTION_TYPES.LOAD_SETTINGS_REQUEST:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          loadSettings: createFetching(),
        },
      };
    case ACTION_TYPES.LOAD_SETTINGS_SUCCESS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          loadSettings: createSuccess(),
        },
        settings: action.settings,
      };
    case ACTION_TYPES.LOAD_SETTINGS_FAILURE:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          loadSettings: createError(action.error),
        },
      };
    case ACTION_TYPES.UPDATE_SETTINGS_REQUEST:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          updateSettings: createFetching(),
        },
      };
    case ACTION_TYPES.UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          updateSettings: createSuccess(),
        },
        settings: action.settings,
      };
    case ACTION_TYPES.UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        fetching: {
          ...state.fetching,
          updateSettings: createError(action.error),
        },
      };
    default:
      return state;
  }
};
