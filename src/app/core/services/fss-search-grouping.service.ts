import { Injectable } from "@angular/core";
import { FssSearchRow, GroupingLevel, RowGrouping, UIGrouping, UIGroupingDetails } from "../models/fss-search-types";


@Injectable({
    providedIn: 'root'
  })

export class FssSearchGroupingService{
  groupingLevels: GroupingLevel[] = [];
  uiGroupings: UIGrouping[] = [];
  
  constructor() { } 

  //Recreate grouping levels and uiGroupings
  resetGroupingDetails(rowGroupings: RowGrouping[], fssSearchRow:FssSearchRow[]){
    var uiGroupingDetails = new UIGroupingDetails();    
    this.groupingLevels = [];

    //copy rowGroupings in rowGroupingsTemp object
    var rowGroupingsTemp = rowGroupings.slice();
    
    //Execute loop till rowGroupingsTemp becomes empty
     while(1 === 1) {
      if(rowGroupingsTemp.length === 0) {
        break;
      }

      //Get inner level groupings for given list of groupings in rowGroupingTemp
      var currentInnerLevelGroupings = this.getInnerLevelRowGroupings(rowGroupingsTemp);

      ///push all current inner groupings to grouping level
      var groupingLevel = new GroupingLevel();
        groupingLevel.level = this.groupingLevels.length + 1;
        currentInnerLevelGroupings.forEach(rowGrouping => {
          groupingLevel.rowGroupings.push(rowGrouping);
        });               
      this.groupingLevels.push(groupingLevel);
      
      //remove all current inner groupings from rowGroupingsTemp
      currentInnerLevelGroupings.forEach(rowGrouping => {
        var rowGroupingIndex = rowGroupingsTemp.findIndex(rgt => rgt.startIndex === rowGrouping.startIndex &&
                                                             rgt.endIndex === rowGrouping.endIndex); 
        rowGroupingsTemp.splice(rowGroupingIndex, 1);
      });               
     }
  
     this.uiGroupings = this.createUIGrouping(fssSearchRow);

     uiGroupingDetails = {
        maxGroupingLevel: this.groupingLevels.length,      
        uiGroupings: this.uiGroupings
     };
     return uiGroupingDetails;
  }

  //Get extreme inner level groupings for given list of groupings in rowGroupingTemp
  getInnerLevelRowGroupings(rowGroupings: RowGrouping[]) {
    var innerLevelRowGroupings: RowGrouping[] = [];
    
    rowGroupings.forEach(rowGrouping => {
       var rowGroup = rowGroupings.find(rg => (rg.startIndex > rowGrouping.startIndex && rg.endIndex < rowGrouping.endIndex) || 
                              (rg.startIndex === rowGrouping.startIndex && rg.endIndex < rowGrouping.endIndex) ||
                              (rg.startIndex > rowGrouping.startIndex && rg.endIndex === rowGrouping.endIndex));

       if(rowGroup === undefined) {
        innerLevelRowGroupings.push(rowGrouping);
       }
    });

    return innerLevelRowGroupings;    
  }       
  
  createUIGrouping(fssSearchRows: FssSearchRow[]){
    this.uiGroupings = [];
  
    if(this.groupingLevels.length > 0){
      var maxLevel = this.groupingLevels[this.groupingLevels.length-1].level;
  
      for(var i = 0; i < fssSearchRows.length; i++){  
        var j = maxLevel;
  
        while(j>=1){
          var groupingLevel = this.groupingLevels.find(g=>g.level === j);               
          var uiGrouping = new UIGrouping();
          uiGrouping.rowIndex = i;
          uiGrouping.class = this.getUIGroupingClass(i, groupingLevel!);
          uiGrouping.colspan = this.getUIGroupingColspan(i, groupingLevel!);
          uiGrouping.rowGrouping = this.getUIRowGrouping(i, groupingLevel!);
          this.uiGroupings.push(uiGrouping);  
          
          j = j - uiGrouping.colspan; 
        }          
      }
    }
    return this.uiGroupings;
  }
  
  getUIGroupingClass(rowIndex: number, groupingLevel: GroupingLevel){
    var groupingClass = "";
  
    if(groupingLevel.rowGroupings.find(g=>g.startIndex === rowIndex)){
      groupingClass = "group group-start";
    }
    else if(groupingLevel.rowGroupings.find(g=>g.endIndex === rowIndex)){
      groupingClass = "group group-end";
    }
    else if(groupingLevel.rowGroupings.find(g=>g.startIndex < rowIndex && g.endIndex > rowIndex)){
      groupingClass = "group";
    }
    else{
      groupingClass = "no-group";
    }
  
    return groupingClass;
  }
  
  getUIGroupingColspan(rowIndex:number, groupingLevel: GroupingLevel) {
    var groupingLevels = this.groupingLevels.slice().reverse()
         .filter(gl => gl.level <= groupingLevel.level && gl.rowGroupings
         .some(g => rowIndex >= g.startIndex &&
          rowIndex <= g.endIndex ));
  
    if(groupingLevels.length > 1) {
      return groupingLevels[0].level - groupingLevels[1].level; 
    } 
    else if(groupingLevels.length === 1 && groupingLevels[0].level !== groupingLevel.level ) {
      return groupingLevel.level - groupingLevels[0].level;
    }
    else {
      return groupingLevel.level;
    }      
  }
    
  getUIRowGrouping(rowIndex: number, groupingLevel:GroupingLevel){
    const grouping = new RowGrouping();
    var rowGrouping = groupingLevel.rowGroupings.find(r=>r.startIndex === rowIndex);
    if(rowGrouping !== undefined){
      grouping.startIndex = rowGrouping.startIndex;
      grouping.endIndex = rowGrouping.endIndex;
    }
    return grouping;
  }

  resetRowGroupings(rowGroupings: RowGrouping[], deleteRowIndex: number){
    //Loop through all rowGroupings to reset rowGroupings based on row/index deletion
    for(var i=rowGroupings.length-1; i>=0; i--){
      if(rowGroupings[i].startIndex <= deleteRowIndex && rowGroupings[i].endIndex >= deleteRowIndex){               
        var grpLength = rowGroupings[i].endIndex - rowGroupings[i].startIndex;
        if(grpLength > 1){
          rowGroupings[i].endIndex = rowGroupings[i].endIndex - 1        
        }
        else{
          rowGroupings.splice(i,1);
        }        
      }
      else if(rowGroupings[i].startIndex > deleteRowIndex && rowGroupings[i].endIndex > deleteRowIndex){
        rowGroupings[i].startIndex = rowGroupings[i].startIndex - 1 
        rowGroupings[i].endIndex = rowGroupings[i].endIndex - 1          
      }          
    }
      
    //Remove duplicate groups if any created after row deletion    
    rowGroupings = rowGroupings.filter((item, pos, self) => self.findIndex(v => v.startIndex === item.startIndex && v.endIndex === item.endIndex) === pos);   
  
    return rowGroupings;
  } 

}
