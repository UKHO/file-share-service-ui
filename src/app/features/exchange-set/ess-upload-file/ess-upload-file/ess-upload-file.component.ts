import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileInputComponent } from '@ukho/design-system';
import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss']
})
export class EssUploadFileComponent implements OnInit {
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  @ViewChild('essFileUpload') essFileUpload: FileInputComponent;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageTitle: string = "";
  messageDesc: string = "";
  displayErrorMessage: boolean = false;
  encList: string[];
  encFile: File;
  constructor(private essUploadFileService: EssUploadFileService) {
  }

  ngOnInit(): void {
    this.essUploadFileService.getEncFilterState().subscribe((encFilterState: boolean) => {
      if (encFilterState) {
        this.displayErrorMessage = true;
        this.showMessage('info', 'Some values have not been added to list');
      }
    });
  }

  uploadListener($event: any): void {
    this.encFile = $event.srcElement.files[0];
    this.displayErrorMessage = false;
    if (this.encFile && this.encFile.type != 'text/csv') {
      this.showMessage('error', 'Please select a .csv or .txt file');
    }
  }

  processEncFile() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      /*
         trims leading & trailing whitespaces , splits texts in new lines
         trims leading & trailing individual ENC's whitespaces
       */
      let encList = this.essUploadFileService.getEncFileData(e.target.result);
      if (this.essUploadFileService.isValidEncFile(this.encFile.type, encList)) {
        encList = this.essUploadFileService.extractEncsFromFile(this.encFile.type, encList);
        this.essUploadFileService.setValidENCs(this.encFile.type, encList);
        this.encList = this.essUploadFileService.getValidEncs();
        this.essUploadFileService.setEncFilterState(encList.length, this.encList.length);
      }
      else {
        this.showMessage('error', 'Please upload valid ENC file.');
      }
    }
    reader.readAsText(this.encFile);
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageTitle: string = "", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageTitle = messageTitle;
    this.messageDesc = messageDesc;
    this.displayErrorMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '-1');
      this.ukhoDialog.nativeElement.focus();
    }
  }
}