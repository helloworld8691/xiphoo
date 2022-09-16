import * as ACTION_TYPES from './types'
import type * as ACTIONS from './actions'
import { FetchingType, createDefault, createFetching, createSuccess, createError } from '../common';
import { Product } from '../productRegistration';
import { SuccessObject } from "../../lib/SuccessObject";


type ValueOf<T> = T[keyof T];
export type ActionsType = ValueOf<{[k in keyof typeof ACTIONS]: ReturnType<typeof ACTIONS[k]>}>


export type initialStateType = {
	fetching: {
		inProgress: boolean,
		startScanning: FetchingType & {
			tagDetected: boolean;
			shadowScanning: boolean;
		}
	},
	resetted: boolean,
	result?: {
		product?: Product,
		laps?: {tag: string, milliseconds: number, msSinceLastLap: number}[],
		tagInfo: SuccessObject
	}
};

const initialState: initialStateType = {
	fetching: {
		inProgress: false,
		startScanning: {...createDefault(), tagDetected: false, shadowScanning: false}
	},
	resetted: false,
}


export const scanProductReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
	switch (action.type) {
case ACTION_TYPES.SET_IN_PROGRESS: return {...state, fetching: {...state.fetching, inProgress: action.inProgress}}
		case ACTION_TYPES.TAG_DETECTED: return {
			...state,
			fetching: {
				...state.fetching,
				startScanning: {...state.fetching.startScanning, tagDetected: action.tagDetected}
			}
		}
		case ACTION_TYPES.START_SCANNING_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				startScanning: {...state.fetching.startScanning, ...createFetching(),}
			},
			resetted: false
		}
		case ACTION_TYPES.START_SHADOW_SCANNING_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				startScanning: {...state.fetching.startScanning, shadowScanning: true }
			},
			resetted: false
		}
		case ACTION_TYPES.START_SCANNING_SUCCESS: return {
			...state,
			fetching: {
				...state.fetching,
				startScanning: { ...state.fetching.startScanning, ...createSuccess() }
			},
			result: {tagInfo: action.tagInfo, product: action.product, laps: action.laps}
		}
		case ACTION_TYPES.START_SCANNING_FAILURE:
			if (state.resetted) return state;
			return {
			...state,
			fetching: {
				...state.fetching,
				inProgress: false,
				startScanning: { ...state.fetching.startScanning, ...createError(action.error) }
			}
		}
		case ACTION_TYPES.RESET: return {...initialState, resetted: true}
		default: return state;
	}
}
