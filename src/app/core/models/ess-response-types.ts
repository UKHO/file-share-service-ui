export interface ExchangeSetDetails {
    _links: ExchangeSetLinks;
    exchangeSetUrlExpiryDateTime: Date;
    requestedProductCount: number;
    exchangeSetCellCount: number;
    requestedProductsAlreadyUpToDateCount: number;
    requestedProductsNotInExchangeSet: ProductsNotInExchangeSet[]
}
export interface ExchangeSetLinks {
    exchangeSetBatchStatusUri: URL;
    exchangeSetBatchDetailsUri: URL;
    exchangeSetFileUri: URL;
}
export interface ProductsNotInExchangeSet {
    productName: string;
    reason: string;
}
export interface BatchStatusReponse {
    batchId: string;
    status: string;
}