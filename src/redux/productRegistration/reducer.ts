import * as ACTION_TYPES from './types'
import type * as ACTIONS from './actions'
import { FetchingType, createDefault, createFetching, createSuccess, createError } from '../common';


type ValueOf<T> = T[keyof T];
export type ActionsType = ValueOf<{[k in keyof typeof ACTIONS]: ReturnType<typeof ACTIONS[k]>}>


export type initialStateType = {
	fetching:{
		fetchProduct: FetchingType
	},
	product?: ACTIONS.Product,
	barcode?: string
};

const initialState: initialStateType = {
	fetching:{
		fetchProduct: createDefault()
	}
}


export const productRegistrationReducer = (state: initialStateType = initialState, action: ActionsType): initialStateType => {
	switch (action.type) {
		case ACTION_TYPES.FETCH_PRODUCT_REQUEST: return {
			...state,
			fetching: {
				...state.fetching,
				fetchProduct: createFetching()
			}
		}
		case ACTION_TYPES.FETCH_PRODUCT_SUCCESS: return {
			...state,
			fetching: {
				...state.fetching,
				fetchProduct: createSuccess()
			},
			product: action.product,
			barcode: action.barcode
		}
		case ACTION_TYPES.FETCH_PRODUCT_FAILURE: return {
			...state,
			fetching: {
				...state.fetching,
				fetchProduct: createError(action.error)
			}
		}
		case ACTION_TYPES.RESET: return {...initialState}
		default: return state;
	}
}
