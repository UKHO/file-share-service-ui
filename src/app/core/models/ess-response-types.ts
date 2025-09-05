export interface ExchangeSetDetails {
  _links: ExchangeSetLinks;
  exchangeSetUrlExpiryDateTime: Date;
  requestedProductCount: number;
  exchangeSetCellCount: number;
  requestedProductsAlreadyUpToDateCount: number;
  requestedProductsNotInExchangeSet: ProductsNotInExchangeSet[];
}
export interface ExchangeSetLinks {
  exchangeSetBatchStatusUri: URL;
  exchangeSetBatchDetailsUri: URL;
  exchangeSetFileUri: URL;
  aioExchangeSetFileUri: URL;
}
export interface ProductsNotInExchangeSet {
  productName: string;
  reason: string;
}
export interface BatchStatusReponse {
  batchId: string;
  status: string;
}

export interface DateInfo {
  updateNumber: number;
  updateApplicationDate: string;
  issueDate: string;
}

export interface BundleInfo {
  bundleType: string;
  location: string;
}

export interface Product {
  productName: string;
  editionNumber: number;
  updateNumbers: number[];
  dates: DateInfo[];
  cancellation: null | any; // Change 'any' to specific type if cancellation details are provided
  fileSize: number;
  ignoreCache: boolean;
  bundle: BundleInfo[];
}

export interface NotReturnedProduct {
  productName: string;
  reason: string;
}

export interface ProductCounts {
  requestedProductCount: number;
  returnedProductCount: number;
  requestedProductsAlreadyUpToDateCount: number;
  requestedProductsNotReturned: NotReturnedProduct[];
}

export interface ProductCatalog {
  products: Product[];
  productCounts: ProductCounts;
}

export interface ProductVersionRequest {
  productName: string;
  editionNumber: number;
  updateNumber: number;
}
