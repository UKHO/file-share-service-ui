import { Pipe, PipeTransform } from '@angular/core';
import { Field,Operator } from '../../../../core/models/fss-search-types';

@Pipe({
  name: 'filterOperator'
})
export class FilterOperatorPipe implements PipeTransform {
  transform(operators: Operator[], selectedField: string, fields: Field[]): any {
    var allowedOperators:any = [];
    console.log(operators, selectedField, fields)
    let dataType: string =  fields.find(f => f.value === selectedField)?.dataType!;
    allowedOperators = operators.filter(operator => operator.supportedDataTypes.includes(dataType));
    console.log("Allowed Operators are ", allowedOperators);
    return allowedOperators;
  }
}
