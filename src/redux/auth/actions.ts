import * as ACTION_TYPES from './types'
import { User } from './user'

export const signInRequestAction = () => {
	return ({
		type: ACTION_TYPES.SIGN_IN_REQUEST as typeof ACTION_TYPES.SIGN_IN_REQUEST,
	})
}

export const signInSuccessAction = (user: User) => {
	return ({
		type: ACTION_TYPES.SIGN_IN_SUCCESS as typeof ACTION_TYPES.SIGN_IN_SUCCESS,
		user
	})
}

export const signInFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.SIGN_IN_FAILURE as typeof ACTION_TYPES.SIGN_IN_FAILURE,
		error
	})
}

export const signOutRequestAction = () => {
	return ({
		type: ACTION_TYPES.SIGN_OUT_REQUEST as typeof ACTION_TYPES.SIGN_OUT_REQUEST,
	})
}

export const signOutSuccessAction = () => {
	return ({
		type: ACTION_TYPES.SIGN_OUT_SUCCESS as typeof ACTION_TYPES.SIGN_OUT_SUCCESS,
	})
}

export const signOutFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.SIGN_OUT_FAILURE as typeof ACTION_TYPES.SIGN_OUT_FAILURE,
		error
	})
}

export const startAutoSignInRequestAction = () => {
	return ({
		type: ACTION_TYPES.START_AUTO_SIGN_IN_REQUEST as typeof ACTION_TYPES.START_AUTO_SIGN_IN_REQUEST,
	})
}

export const startAutoSignInSuccessAction = (user: User) => {
	return ({
		type: ACTION_TYPES.START_AUTO_SIGN_IN_SUCCESS as typeof ACTION_TYPES.START_AUTO_SIGN_IN_SUCCESS,
		user
	})
}

export const startAutoSignInFailureAction = (error: any) => {
	return ({
		type: ACTION_TYPES.START_AUTO_SIGN_IN_FAILURE as typeof ACTION_TYPES.START_AUTO_SIGN_IN_FAILURE,
		error
	})
}
