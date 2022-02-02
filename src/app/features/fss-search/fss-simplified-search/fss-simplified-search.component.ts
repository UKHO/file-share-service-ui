import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FssSearchFilterService } from '../../../core/services/fss-search-filter.service';

@Component({
  selector: 'app-fss-simplified-search',
  templateUrl: './fss-simplified-search.component.html',
  styleUrls: ['./fss-simplified-search.component.scss']
})
export class FssSimplifiedSearchComponent implements OnInit {
  fieldValue: string = "";
  displayDialogMessage: boolean = false;
  messageType: 'info' | 'warning' | 'error' = 'info';
  errorMessageDescription= "";
  errorMessageTitle ="";
  messageTitle: string = "";
  messageDesc: string = "";
  @Output() ShowAdvancedSearchClicked = new EventEmitter<boolean>();
  constructor(private fssSearchFilterService: FssSearchFilterService,) { }

  ngOnInit(): void {
  }

  searchToSimplifiedSearch(){
    this.ShowAdvancedSearchClicked.emit();
  }

  getSimplifiedSearchResult(){
    if (this.fieldValue.trim() !== "") {
      let filterExpression=this.fssSearchFilterService.getFilterExpressionForSimplifiedSearch(this.fieldValue.trim());     
      this.displayDialogMessage = false;
    }else{
      this.errorMessageTitle = "There is a problem with a field";
      this.errorMessageDescription = "Please enter a search field value.";
      this.displayDialogMessage = true;
      this.showErrMessage(
        "warning",
        this.errorMessageTitle,
        this.errorMessageDescription);
    }
  }

  showErrMessage(messageType: 'info' | 'warning' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayDialogMessage = true;
  }
  
}

