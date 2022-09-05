export interface ExchangeSetDetails {
    _links: ExchangeSetLinks;
    exchangeSetUrlExpiryDateTime: Date;
    requestedProductCount: number;
    exchangeSetCellCount: number;
    requestedProductsAlreadyUpToDateCount: number;
    requestedProductsNotInExchangeSet: ProductsNotInExchangeSet[]
}

export interface ExchangeSetLinks {
    batchStatusUri: URL;
    batchDetailsUri: URL;
    fileUri: URL;

}

export interface ProductsNotInExchangeSet {
    productName: string;
    reason: string;
}