import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SortState } from '@ukho/design-system';

interface mappedEnc {
  enc: string,
  selected: boolean
}

@Component({
  selector: 'app-ess-list-encs',
  templateUrl: './ess-list-encs.component.html',
  styleUrls: ['./ess-list-encs.component.scss']
})
export class EssListEncsComponent implements OnInit {
  childVal: any
  encList: mappedEnc[];
  public displayedColumns = ['enc', 'Choose'];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: string[];
  public displaySelectedTableColumns = ['enc' , 'X'];
  constructor(private essUploadFileService: EssUploadFileService) {
   }

  ngOnInit(): void {
    this.displayErrorMessage = this.essUploadFileService.infoMessage;
    if(this.displayErrorMessage){
      this.showMessage('info', 'Some values have not been added to list.');
    }
    this.encList = this.essUploadFileService.getValidEncs().map((enc) => {
      return {
        enc,
        selected : false
      }
    });
  }

  showMessage(
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.displayErrorMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }

  onSortChange(sortState: SortState) {
    this.encList = [...this.encList.sort((a: any, b: any) =>
      (sortState.direction === 'asc')? 
        a[sortState.column].localeCompare(b[sortState.column]):
        b[sortState.column].localeCompare(a[sortState.column])
    )];
  }
  
}
