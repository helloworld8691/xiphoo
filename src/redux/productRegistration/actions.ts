import * as ACTION_TYPES from './types';

export const fetchProductRequestAction = () => {
  return {
    type: ACTION_TYPES.FETCH_PRODUCT_REQUEST as typeof ACTION_TYPES.FETCH_PRODUCT_REQUEST,
  };
};

export const fetchProductSuccessAction = (product: Product, barcode: string) => {
  return {
    type: ACTION_TYPES.FETCH_PRODUCT_SUCCESS as typeof ACTION_TYPES.FETCH_PRODUCT_SUCCESS,
    product,
    barcode
  };
};

export const fetchProductFailureAction = (error: any) => {
  return {
    type: ACTION_TYPES.FETCH_PRODUCT_FAILURE as typeof ACTION_TYPES.FETCH_PRODUCT_FAILURE,
    error,
  };
};

export const resetAction = () => {
  return {
    type: ACTION_TYPES.RESET as typeof ACTION_TYPES.RESET,
  };
};



export interface Product {
  brandName: string;
  productName: string;
  colorName: string;
  sizeName: string;
  brandLogo?: string;
  productImage?: string;
  productURL?: string;
  productDetails: {
    sku: string;
    category?: string;
    subCategory?: string;
    furtherSubCategory?: string;
    description?: string;
    gender?: string;
    origin?: string;
    year?: string;
    ean: string;
    components?: {
      name: string;
      materials: [
        {
          name: string;
          amount: number;
        },
        ...{
          name: string;
          amount: number;
        }[]
      ];
    }[];
    laundry?: {
      washing?: {
        text: string;
        symbol: string;
      };
      bleaching?: {
        text: string;
        symbol: string;
      };
      drying?: {
        text: string;
        symbol: string;
      };
      ironing?: {
        text: string;
        symbol: string;
      };
      professionalCleaning?: {
        text: string;
        symbol: string;
      };
    };
  };
}
