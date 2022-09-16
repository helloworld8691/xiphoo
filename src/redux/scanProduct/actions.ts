import { SuccessObject } from "../../lib/SuccessObject"
import { Product } from '../productRegistration'
import * as ACTION_TYPES from './types'
import NfcManager from 'react-native-nfc-manager';

export const startScanningRequestAction = () => {
	return ({
		type: ACTION_TYPES.START_SCANNING_REQUEST as typeof ACTION_TYPES.START_SCANNING_REQUEST,
	})
}
export const startShadowScanningRequestAction = () => {
	return ({
		type: ACTION_TYPES.START_SHADOW_SCANNING_REQUEST as typeof ACTION_TYPES.START_SHADOW_SCANNING_REQUEST,
	})
}

export const startScanningSuccessAction = (tagInfo: SuccessObject, product?: Product, laps?: {tag: string, milliseconds: number, msSinceLastLap: number}[]) => {
	return ({
		type: ACTION_TYPES.START_SCANNING_SUCCESS as typeof ACTION_TYPES.START_SCANNING_SUCCESS,
		tagInfo, product, laps
	})
}

export const startScanningFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.START_SCANNING_FAILURE as typeof ACTION_TYPES.START_SCANNING_FAILURE,
		error
	})
}

export const resetAction = () => {
	NfcManager.unregisterTagEvent().catch(() => 0);
	NfcManager.cancelTechnologyRequest().catch(() => 0);
	return ({
		type: ACTION_TYPES.RESET as typeof ACTION_TYPES.RESET,
	})
}
export const resetActionSoft = () => {
	return ({
		type: ACTION_TYPES.RESET as typeof ACTION_TYPES.RESET,
	})
}

export const tagDetectedAction = (tagDetected: boolean) => {
	return ({
		type: ACTION_TYPES.TAG_DETECTED as typeof ACTION_TYPES.TAG_DETECTED,
		tagDetected
	})
}

export const setInProgressAction = (inProgress:boolean) => {
	return ({
		type: ACTION_TYPES.SET_IN_PROGRESS as typeof ACTION_TYPES.SET_IN_PROGRESS,
		inProgress
	})
}
