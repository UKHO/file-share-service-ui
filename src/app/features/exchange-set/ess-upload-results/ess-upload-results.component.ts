import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ess-upload-results',
  templateUrl: './ess-upload-results.component.html',
  styleUrls: ['./ess-upload-results.component.scss']
})
export class EssUploadResultsComponent implements OnInit {
  encList: string[];
  public displayedColumns = ['EncName', 'Choose'];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  constructor(private essUploadFileService: EssUploadFileService) { }

  ngOnInit(): void {
    
    this.displayErrorMessage = this.essUploadFileService.infoMessage;
    if(this.displayErrorMessage){
      this.showMessage('info', 'Some values have not been added to list.');
    }

    this.encList = this.essUploadFileService.getValidEncs();
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

}
