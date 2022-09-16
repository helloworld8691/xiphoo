import { SettingsType } from './reducer'
import * as ACTION_TYPES from './types'

export const loadSettingsRequestAction = () => {
	return ({
		type: ACTION_TYPES.LOAD_SETTINGS_REQUEST as typeof ACTION_TYPES.LOAD_SETTINGS_REQUEST,
	})
}

export const loadSettingsSuccessAction = (settings: SettingsType) => {
	return ({
		type: ACTION_TYPES.LOAD_SETTINGS_SUCCESS as typeof ACTION_TYPES.LOAD_SETTINGS_SUCCESS,
		settings
	})
}

export const loadSettingsFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.LOAD_SETTINGS_FAILURE as typeof ACTION_TYPES.LOAD_SETTINGS_FAILURE,
		error
	})
}

export const updateSettingsRequestAction = () => {
	return ({
		type: ACTION_TYPES.UPDATE_SETTINGS_REQUEST as typeof ACTION_TYPES.UPDATE_SETTINGS_REQUEST,
	})
}

export const updateSettingsSuccessAction = (settings: SettingsType) => {
	return ({
		type: ACTION_TYPES.UPDATE_SETTINGS_SUCCESS as typeof ACTION_TYPES.UPDATE_SETTINGS_SUCCESS,
		settings
	})
}

export const updateSettingsFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.UPDATE_SETTINGS_FAILURE as typeof ACTION_TYPES.UPDATE_SETTINGS_FAILURE,
		error
	})
}

export const addLocationPromiseAction = (payload: any) => {
	return ({
		type: ACTION_TYPES.ADD_LOCATION_PROMISE as typeof ACTION_TYPES.ADD_LOCATION_PROMISE,
		payload
	})
}
