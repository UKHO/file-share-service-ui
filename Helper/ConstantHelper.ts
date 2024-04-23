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


type BatchAttribute = {
  key: string;
  value: string;
};

export const attributeBusinessUnit: BatchAttribute = { key: 'BusinessUnit', value: 'ADDS' };
export const attributeProductType: BatchAttribute = { key: 'Product Type', value: 'AVCS' };
export const attributeWeekYear: string = 'Year / Week';
export const attributeFileName: BatchAttribute = { key: 'File Name', value: 'V01X01' };
export const attributeFileSize: BatchAttribute = {key: 'FileSize', value: '1000'};
export const attributeMimeType: BatchAttribute = {key: 'MimeType', value: 'text/plain'};
export const attributeMediaType: BatchAttribute = {key: 'Media Type', value: 'DVD'};
export const attributeMultipleMediaTypes: BatchAttribute = {key: 'Media Type', value: 'CD DVD'};
export const attributeMultipleMediaType: BatchAttribute = {key: 'Media Type', value: 'CD DVD'};
export const searchNonExistBatchAttribute = 'pqtestresult';

export const batchAttributeKeys = [
  'Media Type',
  'Product Type',
  'File Name',
  'Year / Week',
  'Year'
]
