import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  encList: string[];
  encFile: File;
  constructor(private essUploadFileService: EssUploadFileService) {}

  ngOnInit(): void {
    this.essUploadFileService.getEncFilterState().subscribe((encFilterState: boolean) => {
        if(encFilterState){
           this.displayErrorMessage = true;
           this.showMessage('info','Some values have not been added to list');
        }
    });
  }

  uploadListener($event: any): void {
        this.encList = [];
        this.encFile = $event.srcElement.files[0];
        this.displayErrorMessage = false;
        if (this.encFile && this.encFile.type !== 'text/plain') {
          this.showMessage('error','Please select a .csv or .txt file');
        }
  }

  loadFileReader() {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.processFile(e.target.result);
        };
        reader.readAsText(this.encFile);
  }
  processFile(rawData: string): void{
    /*
      trims leading & trailing whitespaces , splits texts in new lines
      trims leading & trailing individual ENC's whitespaces
    */
    let encList =  this.essUploadFileService.getEncFileData(rawData);
    if(this.essUploadFileService.isValidEncFile(this.encFile.type, encList)){
      encList = this.essUploadFileService.extractEncsFromFile(encList);
      this.essUploadFileService.setValidEncs(encList);
      this.encList = this.essUploadFileService.getValidEncs();
      this.essUploadFileService.setEncFilterState(encList.length,this.encList.length);
    }
    else{
      this.showMessage('error','Please upload valid ENC file.');
    }
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
