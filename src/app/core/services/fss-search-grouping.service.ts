import { Injectable } from "@angular/core";
import { FssSearchRow, GroupingLevel, RowGrouping, UIGrouping } from "../models/fss-search-types";


@Injectable({
    providedIn: 'root'
  })

export class FssSearchGroupingService{
  groupingDetails: GroupingDetails;
  groupingLevels: GroupingLevel[] = [];
  currentGroupStartIndex: number = 0;
  currentGroupEndIndex: number = 0;
  uiGroupings: UIGrouping[] = [];
  
  constructor() { }  
       
  resetGroupingDetails(rowGroupings: RowGrouping[], fssSearchRow:FssSearchRow[]){
    var groupingDetails = new GroupingDetails();
    var isInnerGroupError = false;
    this.groupingLevels = [];
    
    rowGroupings.forEach(row => {
      this.currentGroupStartIndex = row.startIndex;
      this.currentGroupEndIndex = row.endIndex;
     
      if(this.groupingLevels.length === 0){   

        var groupingLevel = new GroupingLevel();
        groupingLevel.level = 1;
        groupingLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});
        this.groupingLevels.push(groupingLevel);

      }  
      else if(this.isOuterLevelGroup()){
          
        var matchedGroupingLevel = this.groupingLevels.filter(g=> g.rowGroupings.some( r => 
            r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));

        var newLevel = new GroupingLevel();
        var matchedLevel = matchedGroupingLevel[matchedGroupingLevel.length-1];
        
        if(matchedLevel !== undefined){
          var currentlevel = this.groupingLevels.find(g => g.level === matchedLevel.level && g.rowGroupings.find(r=> 
          r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));      
          
          if(currentlevel !== undefined) {
            newLevel = currentlevel;      
          }
          else {
            newLevel.level = matchedLevel.level + 1;
          }
        }
            
        var newLevelIndex = this.groupingLevels.findIndex(i => i.level === newLevel.level);           
        if(newLevelIndex !== -1){
            this.groupingLevels[newLevelIndex].rowGroupings.push({startIndex:this.currentGroupStartIndex, endIndex:this.currentGroupEndIndex});
        }
        else{
            newLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});
            this.groupingLevels.push(newLevel);
        }
      }     
      else if(this.isInnerLevelOfExistingGroup()) {         
        isInnerGroupError = true;            
      }    
      else if(this.isInnerLevelGroup()){  

        var existingGroupingLevel = this.groupingLevels.filter(g => g.rowGroupings.some( r =>    
          (r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) ||
          (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex )));

        var existingLevel = existingGroupingLevel[0];
        var existingLevelIndex = this.groupingLevels.findIndex(i => i === existingLevel);        
          existingLevel.rowGroupings.push({startIndex: this.currentGroupStartIndex, endIndex: this.currentGroupEndIndex});

        this.groupingLevels[existingLevelIndex] = existingLevel;
      }    
    }); 

    this.uiGroupings = this.createUIGrouping(fssSearchRow);

    groupingDetails = {
        groupingLevels: this.groupingLevels,
        isInnerGroupError: isInnerGroupError,
        uiGroupings: this.uiGroupings
    };
    return groupingDetails;
  }
  
  isOuterLevelGroup(){
    var outerGroup =  this.groupingLevels.filter(g=> g.rowGroupings.some( 
      r => r.startIndex >= this.currentGroupStartIndex && r.endIndex <= this.currentGroupEndIndex));
  
    if (outerGroup.length>0){
      return true;
    }
    return false;
  }
   
  isInnerLevelOfExistingGroup(){
    var innerGroup = this.groupingLevels.filter(g => g.rowGroupings.find(
                    r => r.startIndex <= this.currentGroupStartIndex && r.endIndex >= this.currentGroupEndIndex));
  
    if (innerGroup.length>0){
      return true;
    }
    return false;
  }
  
  isInnerLevelGroup(){  
    var innerGroup = this.groupingLevels.find(g => g.rowGroupings.find( r => 
      ((r.startIndex < this.currentGroupStartIndex && r.endIndex < this.currentGroupEndIndex) && r.startIndex < this.currentGroupEndIndex) ||
      (r.startIndex > this.currentGroupStartIndex && r.endIndex > this.currentGroupEndIndex )));
  
    if (innerGroup !== undefined){
      return true;
    }
    return false;
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
          uiGrouping.rowGroupings = this.getUIRowGrouping(i, groupingLevel!);
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
      return groupingLevels[0].level;
    }
    else {
      return groupingLevel.level;
    }      
  }
  
  getUIRowGrouping(rowIndex: number, groupingLevel:GroupingLevel){
    var rowGrouping = groupingLevel.rowGroupings.filter(r=>r.startIndex === rowIndex);
    return rowGrouping;
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

export class GroupingDetails{
  groupingLevels: GroupingLevel[];
  isInnerGroupError: boolean;
  uiGroupings:UIGrouping[];
}