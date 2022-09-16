import * as ACTIONS from './actions'
import type { ThunkAction } from 'redux-thunk';
import type { StateType } from '../store';
import type {ActionsType} from './reducer';
import { Configuration } from '../../api/runtime';
import { DefaultApi } from '../../api';

export const fetchProduct = (barcode: string): ThunkAction<void, StateType, never, ActionsType> => async (dispatch, getState) => {
	try {
		dispatch(ACTIONS.fetchProductRequestAction());
		const user = getState().auth.user;
		if(!user) throw new Error("User has to be logged in!")
		const api = new DefaultApi(
      new Configuration({
        apiKey: user.token,
      }),
    );
    let product = (await api.productBarcodeGet({barcode})) as ACTIONS.Product;

		dispatch(ACTIONS.fetchProductSuccessAction(product, barcode));
	} catch (error) {
		dispatch(ACTIONS.fetchProductFailureAction(error));
	}
}