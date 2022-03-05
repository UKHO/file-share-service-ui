export const stringOperatorList = [
    '=',
    '<>',
    'StartsWith',    
    'Not StartsWith',
    'EndsWith',
    'Not EndsWith',
    'Contains',
    'Not Contains'
  ]

export const symbolOperatorListForFileSize = [
    '=',
    '<>',
    '>',    
    '>=',
    '<',
    '<='
 ]

export const symbolOperatorListForDate = [
  '=',
  '<>',
  '= null',
  '<> null',
  '>',    
  '>=',
  '<',
  '<='
]

export const searchQuerySqlInjection = "adds''; drop table BatchAttribute";
export const searchNonExistBatchAttribute = 'pqtestresult';
export const batchAttributeSpecialChar = '$£';

type BatchAttribute = {
  key: string;
  value: string;
};

export const attributeBusinessUnit: BatchAttribute = { key: 'BusinessUnit', value: 'ADDS' };
export const attributeProductType: BatchAttribute = { key: 'Product Type', value: 'AVCS' };
export const attributeFileSize: BatchAttribute = {key: 'FileSize', value: '1000'};
export const attributeMimeType: BatchAttribute = {key: 'MimeType', value: 'text/plain'};
