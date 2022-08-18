import { Router } from '@angular/router';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  encList: mappedEnc[];
  public displayedColumns = ['EncName', 'Choose'];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: string[];
  displaySingleEncVal: boolean = false;

  public displaySelectedTableColumns = ['EncName', 'X'];
  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router) { }

  ngOnInit(): void {
    this.selectedEncList = this.essUploadFileService.getValidEncs();
    this.displayErrorMessage = this.essUploadFileService.infoMessage;
    if (this.displayErrorMessage) {
      this.showMessage('info', 'Some values have not been added to list.');
    }
    this.setEncList();
    this.essUploadFileService.getNotifySingleEnc().subscribe((notify: boolean) => {
      if (notify) {
        this.setEncList()
      }
    });
  }

  setEncList() {
    this.encList = this.essUploadFileService.getValidEncs().map((enc) => {
      return {
        enc,
        selected: false
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

  handleChange(enc: string) {

  }

  displaySingleEnc() {
    this.displaySingleEncVal = true;
  }
}
