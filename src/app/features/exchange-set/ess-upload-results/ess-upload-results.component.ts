import { EssUploadFileService } from './../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface MappedEnc {
  enc: string;
  selected: boolean;
}

@Component({
  selector: 'app-ess-upload-results',
  templateUrl: './ess-upload-results.component.html',
  styleUrls: ['./ess-upload-results.component.scss'],
})
export class EssUploadResultsComponent implements OnInit {
  encList: MappedEnc[];
  public displayedColumns = ['EncName', 'Choose'];
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: string[];
  public displaySelectedTableColumns = ['EncName', 'X'];
  constructor(private essUploadFileService: EssUploadFileService) {
  }

  ngOnInit(): void {
    this.displayErrorMessage = this.essUploadFileService.infoMessage;
    this.essUploadFileService.clearSelectedEncs();
    if (this.displayErrorMessage) {
      this.showMessage('info', 'Some values have not been added to list.');
    }
    console.log(this.essUploadFileService.getValidEncs());
    this.encList = this.essUploadFileService.getValidEncs().map((enc) => ({
      enc,
      selected: false,
    }));
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
    const seletedEncs: string[] = this.essUploadFileService.getSelectedENCs();
    if (!seletedEncs.includes(enc)) {
      this.essUploadFileService.addSelectedEnc(enc);
    } else if (seletedEncs.includes(enc)) {
      this.essUploadFileService.removeSelectedEncs(enc);
    }
    this.syncEncsBetweenTables();
  }

  syncEncsBetweenTables() {
    this.selectedEncList = this.essUploadFileService.getSelectedENCs();
    this.encList = this.encList.map((item, index) => ({
        enc: item.enc,
        selected: this.selectedEncList.includes(item.enc) ? true : false,
      })
    );
  }

}
