export interface ExchangeSetDetails {
    links: ExchangeSetLinks;
    urlExpiryDateTime: Date;
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

export interface BatchStatusReponse
{
    batchId: string;
    status: string;
}