import { FssSearchService } from './../../core/services/fss-search.service';
import { Component, OnInit } from '@angular/core';
import { Operator,IFssSearchService,Field,JoinOperator,FssSearchRow } from './../../core/models/fss-search-types';
import { FssSearchResultService } from '../../core/services/fss-search-result.service';
import { FssSearchFilterService } from '../../core/services/fss-search-filter.service';


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
  searchResult: any = [];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  searchButtonText: string = "Search";
  displayMessage: boolean = false;
  displaySearchResult: Boolean = false;
  constructor(private fssSearchTypeService: IFssSearchService, private fssSearchFilterService: FssSearchFilterService, private searchResultService: FssSearchResultService) { }
  
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
    this.searchButtonText = "Refine Search" 
    var filter = this.fssSearchFilterService.getFilterExpression(this.fssSearchRows);
    
    if(filter != null){
      this.searchResult = [];
      this.searchResultService.getSearchResult(filter).subscribe((res: {}) => {
        this.searchResult = res;
        if(this.searchResult.count > 0)
        {
          this.searchResult = Array.of(this.searchResult['entries']);
          this.displaySearchResult = true;  
          this.toggleMessage(false);
          console.log("apiResponse", this.searchResult);
        }
         else{
          this.toggleMessage(
            true, 
            "warning", 
            "No results can be found for this match.",
            "Try searching again using differenct query paramerters.\nOr use the popular searches to see results. You can refine these queries once the results are shown."
            );
         }
      })
    } 
  }

  toggleMessage(flag:boolean, messageType:'info' | 'warning' | 'success' | 'error'= "info", messageTitle:string="", messageDesc:string="")
  {    
    this.messageTitle = "";
    this.messageDesc = "";
    this.displayMessage = flag;
 
    if(flag === true)
    {
      this.messageType = messageType;
      this.messageTitle = messageTitle;
      this.messageDesc = messageDesc;      
    }
  }
  
}
