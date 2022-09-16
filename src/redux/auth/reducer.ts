import * as ACTION_TYPES from './types'
import type * as ACTIONS from './actions'
import { FetchingType, createDefault, createFetching, createSuccess, createError } from '../common';
import { User } from './user';


type ValueOf<T> = T[keyof T];
export type ActionsType = ValueOf<{[k in keyof typeof ACTIONS]: ReturnType<typeof ACTIONS[k]>}>


export type initialStateType = {
	fetching:{
		signIn: FetchingType,
		signOut: FetchingType,
		startAutoSignIn: FetchingType
	},
	user: User | null
};

const initialState: initialStateType = {
	fetching:{
		signIn: createDefault(),
		signOut: createDefault(),
		startAutoSignIn: createDefault()
	},
	user: null
}


export const authReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
	switch(action.type){
		case ACTION_TYPES.SIGN_IN_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				signIn: createFetching()
			}
		}
		case ACTION_TYPES.SIGN_IN_SUCCESS: return {
			...state,
			fetching: {
				...state.fetching,
				signIn: createSuccess()
			},
			user: action.user
		}
		case ACTION_TYPES.SIGN_IN_FAILURE: return {
			...state,
			fetching: {
				...state.fetching,
				signIn: createError(action.error)
			}
		}
		case ACTION_TYPES.SIGN_OUT_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				signOut: createFetching()
			}
		}
		case ACTION_TYPES.SIGN_OUT_SUCCESS: return {
			...state,
			fetching: {
				...state.fetching,
				signOut: createSuccess()
			},
			user: null
		}
		case ACTION_TYPES.SIGN_OUT_FAILURE: return {
			...state,
			fetching: {
				...state.fetching,
				signOut: createError(action.error)
			}
		}
		case ACTION_TYPES.START_AUTO_SIGN_IN_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				startAutoSignIn: createFetching()
			}
		}
		case ACTION_TYPES.START_AUTO_SIGN_IN_SUCCESS: return {
			...state,
			fetching: {
				...state.fetching,
				startAutoSignIn: createSuccess()
			},
			user: action.user
		}
		case ACTION_TYPES.START_AUTO_SIGN_IN_FAILURE: return {
			...state,
			fetching: {
				...state.fetching,
				startAutoSignIn: createError(action.error)
			}
		}
		default: return state;
	}
}
