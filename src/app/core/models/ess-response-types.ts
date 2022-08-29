export interface ExchangeSetDetails {
    links: ExchangeSetLinks;
    urlExpiryDateTime: Date;
    requestedProductCount: number;
    exchangeSetCellCount: number;
    requestedProductsAlreadyUpToDateCount: number;
    requestedProductsNotInExchangeSet: ProductsNotInExchangeSet[]
}

export interface ExchangeSetLinks {
    batchStatusUri: string;
    batchDetailsUri: string;
    fileUri: string;
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