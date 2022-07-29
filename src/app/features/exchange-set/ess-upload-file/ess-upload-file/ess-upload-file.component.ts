import { EssUploadFileService } from './../../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileInputComponent } from '@ukho/design-system';

@Component({
  selector: 'app-ess-upload-file',
  templateUrl: './ess-upload-file.component.html',
  styleUrls: ['./ess-upload-file.component.scss']
})
export class EssUploadFileComponent implements OnInit {

  isDataShow: boolean = false;
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc: string = "";
  displayMessage: boolean = false;
  @ViewChild("ukhoTarget") ukhoDialog: ElementRef;
  @ViewChild("textfileUpload") textfileUpload: FileInputComponent;
  essId: any;
  encData = [
    { Id: 1, name: 'Upload your whole permit' }
  ]
  encFileList: any[] = [];
  encList: any;
  fileOutput: any;
  errorMessageDescription = "";
  getValidEncNumbers: any[] = [];
  constructor(private essUploadFileService: EssUploadFileService) { }

  ngOnInit(): void {
  }

  uploadTextPermitFile() {
    var file = this.textfileUpload.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.TXT')) {
        this.fileOutput = e.target.result;
        this.encList = this.fileOutput.split('\n');
  
        for (var i = 0; i < this.encList.length; i++) {
          var encName = this.encList[i].substring(0, 8);

          if (this.essUploadFileService.validate_ENCFormat(encName)) {
            this.encFileList.push(encName);
            this.getValidEncNumbers = this.encFileList.filter((el, i, a) => i === a.indexOf(el))
            this.isDataShow = true;
            this.errorMessageDescription = "Some values have not been added to list"
            this.showMessage("info", this.errorMessageDescription);
          }
        }
      }
       else {
        this.errorMessageDescription = "Allowed only .txt file"
        this.showMessage("error", this.errorMessageDescription);
        this.isDataShow = false;
      }

    };
    reader.readAsText(file);
  }

  showMessage(messageType: 'info' | 'warning' | 'success' | 'error' = "info", messageDesc: string = "") {
    this.messageType = messageType;
    this.messageDesc = messageDesc;
    this.displayMessage = true;
    if (this.ukhoDialog !== undefined) {
      this.ukhoDialog.nativeElement.setAttribute('tabindex', '0');
      this.ukhoDialog.nativeElement.focus();
    }
  }

  onChangeExchangeSetItem(event: any) {
    this.essId = "essId" + event.target.value;
  }

}