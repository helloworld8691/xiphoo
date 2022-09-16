export type Result = {
  product?: Product,
  laps?: { tag: string, milliseconds: number, msSinceLastLap: number }[],
  tagInfo: SuccessObject
}

export type SuccessObject = {
  xiphooTag: boolean;
  offlineCheck: boolean;
  onlineCheck: boolean;
  uid: string
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
