import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fss-search',
  templateUrl: './fss-search.component.html',
  styleUrls: ['./fss-search.component.scss']
})
export class FssSearchComponent implements OnInit {
  options = ['AND', 'OR'];
  Operators = ['>', '='];
  batches = ['@BatchexpiryDate', '@Batchexpiryyear'];
  constructor() { }

  checkboxes: any[] = [];
  selectedRow: any;
  searchArray: Array<any> = [];
  newDynamic: any = {};
  ngOnInit(): void {
      this.newDynamic = {option: "", batch: "",Operator:"",datevalue:""};
      this.searchArray.push(this.newDynamic);
      this.checkboxes = new Array(this.searchArray.length);
      this.checkboxes.fill(false);
  }

  toggleSelection(event: any, i: any) {
    this.checkboxes[i] = event.target.checked;
    console.log(this.checkboxes[i]);
  }

  setClickedRow(index: any) {
    this.selectedRow = index;
    console.log(this.selectedRow);
  }

  addRow(index: any) {  
      this.newDynamic = {option: "", batch: "",Operator:"",datevalue:""};
      this.searchArray.push(this.newDynamic);
      this.checkboxes.splice(index, 0, false);

      console.log(this.searchArray);
      return true;
  }
  
  deleteRow(index: any) {
      if(this.searchArray.length ==1) {
          return false;
      } else {
          this.searchArray.splice(index, 1);
          return true;
      }
  }

}
