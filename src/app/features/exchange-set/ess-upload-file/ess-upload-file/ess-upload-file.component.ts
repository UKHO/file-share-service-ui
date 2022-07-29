import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileInputComponent } from '@ukho/design-system';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss'],
})
export class EssUploadFileComponent implements OnInit {
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  @ViewChild('textfileUpload') textfileUpload: FileInputComponent;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  essId: any;
  encData = [{ id: 1, name: 'Upload your whole permit' }];
  encList: string[];
  constructor(private essUploadFileService: EssUploadFileService) {}

  ngOnInit(): void {}

  uploadTextPermitFile() {
    this.encList = [];
    if (this.textfileUpload.files && this.textfileUpload.files.length > 0) {
        const encFile = this.textfileUpload.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          /*
            trims leading & trailing whitespaces , splits texts in new lines
            trims leading & trailing individual ENC's whitespaces
          */
          const encList = e.target.result.trim().split('\n').map((enc: string) => enc.trim());
          if(this.essUploadFileService.validatePermitFile(encFile.type,encList)){
            this.essUploadFileService.setValidEncs(encList);
            this.encList = this.essUploadFileService.getValidEncs();
            this.showMessage('info','Some values have not been added to list');
          }else{
            this.showMessage('error','Allowded .txt only');
          }
        };
        reader.readAsText(encFile);
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

  onChangeExchangeSetItem(event: any) {
    this.essId = 'essId' + event.target.value;
  }
}
