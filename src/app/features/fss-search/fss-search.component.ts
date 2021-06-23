import { FssSearchService } from './../../core/services/fss-search.service';
import { Component, OnInit } from '@angular/core';
import { Operator,IFssSearchService,Field,JoinOperator,FssSearchRow } from './../../core/models/fss-search-types';
import { FssSearchFilterService } from 'src/app/core/services/fss-search-filter.service';


@Component({
  selector: 'app-fss-search',
  templateUrl: './fss-search.component.html',
  styleUrls: ['./fss-search.component.scss'],
  providers: [
    { provide: IFssSearchService, useClass: FssSearchService }
  ]
})
export class FssSearchComponent implements OnInit {

  joinOperators: JoinOperator[] =[];
  fields: Field[] =[];
  operators: Operator[] =[];
  fssSearchRows: FssSearchRow[] = [];
  rowId: number =1;
  
   constructor(private fssSearchTypeService: IFssSearchService, 
    private fssSearchFilterService: FssSearchFilterService) { 
    
  }

  ngOnInit(): void {
      this.joinOperators = this.fssSearchTypeService.getJoinOperators();
      this.fields = this.fssSearchTypeService.getFields();
      this.operators = this.fssSearchTypeService.getOperators();
      this.addSearchRow();
  }

  addSearchRow() {  
      this.fssSearchRows.push(this.getDefaultSearchRow());
      this.rowId+= 1;
  }

  getDefaultSearchRow(){
      var fssSearchRow= new FssSearchRow();
      fssSearchRow.joinOperators= this.joinOperators;
      fssSearchRow.fields= this.fields;
      fssSearchRow.operators= this.operators;
      fssSearchRow.group= false;
      fssSearchRow.selectedJoinOperator= this.joinOperators[0].value;
      fssSearchRow.selectedField= this.fields[0].value;
      fssSearchRow.selectedOperator= this.operators[0].value;
      fssSearchRow.value= '';
      fssSearchRow.rowId= this.rowId;
      return fssSearchRow;
  }

  onSearchRowDeleted(rowId: number) {
     this.fssSearchRows.splice(this.fssSearchRows.findIndex(fsr => fsr.rowId=== rowId),1);
  }

  getSearchResult() {

    var filter = this.fssSearchFilterService.getFilterExpression(this.fssSearchRows);
    
    console.log(filter);
  }
  
}
