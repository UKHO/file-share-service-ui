import { ExchangeSetApiService } from './../../../core/services/exchange-set-api.service';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SortState } from '@ukho/design-system';
import { Router } from '@angular/router';
import { ExchangeSetDetails } from '../../../core/models/ess-response-types';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';

interface MappedEnc {
  enc: string;
  selected: boolean;
}
enum SelectDeselect {
  select = 'Select all',
  deselect = 'Deselect all'
};
@Component({
  selector: 'app-ess-list-encs',
  templateUrl: './ess-list-encs.component.html',
  styleUrls: ['./ess-list-encs.component.scss']
})
export class EssListEncsComponent implements OnInit {
  displayLoader: boolean = false;
  addSingleEncRenderFrom: string = 'encList';
  addSingleEncBtnText: string = 'Add ENC';
  encList: MappedEnc[];
  public displayedColumns = ['enc', 'Choose'];
  maxEncSelectionLimit: number;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: string[];
  displaySingleEncVal: boolean = false;
  public displaySelectedTableColumns = ['enc', 'X'];
  exchangeSetDetails: ExchangeSetDetails;
  estimatedTotalSize: string = '0MB';
  selectDeselectText: string;
  selectDeselectAlert: string;
  showSelectDeselect: boolean;
  essSilentTokenRequest: SilentRequest;
  essTokenScope: any = [];
  selectDeselectEncAlert: string;

  constructor(private essUploadFileService: EssUploadFileService,
    private elementRef: ElementRef,
    private route: Router,
    private msalService: MsalService,
    private exchangeSetApiService: ExchangeSetApiService,
    private essInfoErrorMessageService: EssInfoErrorMessageService
  ) {
    this.essTokenScope = AppConfigService.settings['essConfig'].apiScope;
    this.essSilentTokenRequest = {
      scopes: [this.essTokenScope],
    };
  }

  ngOnInit(): void {
    this.maxEncSelectionLimit = Number.parseInt(
      AppConfigService.settings['essConfig'].MaxEncSelectionLimit,
      10
    );
    this.essUploadFileService.clearSelectedEncs();
    this.setEncList();
    this.essUploadFileService.getNotifySingleEnc().subscribe((notify: boolean) => {
      if (notify) {
        this.setEncList();
        this.syncEncsBetweenTables();
      }
    });
    this.selectedEncList = this.essUploadFileService.getSelectedENCs();
    this.selectDeselectText = this.getSelectDeselectText();
    this.showSelectDeselect = this.getSelectDeselectVisibility();
  }

  setEncList() {
    this.encList = this.essUploadFileService.getValidEncs().map((enc) => ({
      enc,
      selected: false
    }));
  }

  triggerInfoErrorMessage(
    showInfoErrorMessage: boolean,
    messageType: 'info' | 'warning' | 'success' | 'error' = 'info',
    messageDesc: string = ''
  ) {
    this.essInfoErrorMessageService.showInfoErrorMessage = {
      showInfoErrorMessage,
      messageType,
      messageDesc,
    };
  }
  handleChange(enc: string,event?: Event | null) {
    const seletedEncs: string[] = this.essUploadFileService.getSelectedENCs();
    this.triggerInfoErrorMessage(false,'info', '');
    if (seletedEncs.includes(enc)) {
      this.essUploadFileService.removeSelectedEncs(enc);
      this.selectDeselectEncAlert= enc + ' Remove From Selected List';
    } else if (this.maxEncSelectionLimit > seletedEncs.length) {
      this.essUploadFileService.addSelectedEnc(enc);
      this.selectDeselectEncAlert= enc + ' Added From Selected List';
    } else {
      const currCheckedElement = (document.querySelector(`ukho-checkbox[aria-label=${enc}] input`) as HTMLElement);
      if(currCheckedElement){
        currCheckedElement.click(); // will uncheck the selected checkbox
      }
      this.triggerInfoErrorMessage(true,'error', 'No more than ' + this.maxEncSelectionLimit + ' ENCs can be selected.');
      return;
    }
    this.syncEncsBetweenTables();
    setTimeout(() => {
      const element = document.querySelector(`ukho-checkbox[aria-label=${enc}] input`) as HTMLElement;
      if(element && event){
         element.focus();
      }
    },5);
  }

  syncEncsBetweenTables() {
    this.selectedEncList = this.essUploadFileService.getSelectedENCs();
    this.encList = this.encList.map((item, index) => ({
      enc: item.enc,
      selected: this.selectedEncList.includes(item.enc) ? true : false,
    }));
    this.estimatedTotalSize = this.getEstimatedTotalSize();
    this.showSelectDeselect = this.getSelectDeselectVisibility();
    if (this.selectedEncList.length === 0) {
      this.selectDeselectText = SelectDeselect.select;
      return;
    }
    if (this.selectDeselectText === SelectDeselect.select && this.checkMaxEncSelectionAndSelectedEncLength()) {
      this.selectDeselectText = SelectDeselect.deselect;
      return;
    }
  }

    onSortChange(sortState: SortState) {
    this.encList = [
      ...this.encList.sort((a: any, b: any) =>
        sortState.direction === 'asc'
          ? a[sortState.column].localeCompare(b[sortState.column])
          : b[sortState.column].localeCompare(a[sortState.column])
      ),
    ];
  }

  switchToESSLandingPage() {
    this.route.navigate(['exchangesets']);
  }

  displaySingleEnc() {
    this.displaySingleEncVal = true;
    setTimeout(()=>{
      // eslint-disable-next-line max-len
      const encInput = this.elementRef.nativeElement.querySelectorAll('app-ess-add-single-encs .container .addSingleFileSection ukho-textinput input');
      encInput[0].focus();
    },);
  }

  exchangeSetCreationResponse(selectedEncList: any[]) {
    this.displayLoader = true;
  if (selectedEncList != null) {
      this.exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe((result) => {
        this.displayLoader = false;
        this.exchangeSetDetails = result;
        this.essUploadFileService.setExchangeSetDetails(this.exchangeSetDetails);
        this.route.navigate(['exchangesets', 'enc-download']);
      },
        (error) => {
          this.displayLoader = false;
          this.triggerInfoErrorMessage(true,'error', 'There has been an error');
        }
      );
   }
  }

  getEstimatedTotalSize() {
    if(this.selectedEncList && this.selectedEncList.length > 0){
    return this.essUploadFileService.getEstimatedTotalSize(this.selectedEncList.length);
    }
    else{
      return '0MB';
    }
  }
  getSelectDeselectText() {
    const selectDeselectText = this.checkMaxEncSelectionAndSelectedEncLength() ? SelectDeselect.deselect : SelectDeselect.select;
    return selectDeselectText;
  }
  checkMaxEncSelectionAndSelectedEncLength() {
    const maxEncSelectionLimit = this.maxEncSelectionLimit > this.encList.length ? this.encList.length : this.maxEncSelectionLimit;
    return maxEncSelectionLimit === this.selectedEncList.length;

  }
  selectDeselectAll() {
    if (!this.checkMaxEncSelectionAndSelectedEncLength() && this.selectDeselectText === SelectDeselect.select) {
      this.selectDeselectAlert = 'Selected All ENC\'s' ;
      this.essUploadFileService.addAllSelectedEncs();
    } else {
      this.selectDeselectAlert = 'DeSelected All ENC\'s' ;
      this.essUploadFileService.clearSelectedEncs();
    }
    this.syncEncsBetweenTables();
    this.selectDeselectText = this.getSelectDeselectText();
  }

  getSelectDeselectVisibility() {
    return this.encList.length <= this.maxEncSelectionLimit;
  }
  requestEncClicked() {
    this.displayLoader = true;
    this.msalService.instance.acquireTokenSilent(this.essSilentTokenRequest).then(response => {
      this.exchangeSetCreationResponse(this.selectedEncList);
    }, error => {
      this.msalService.instance
        .loginPopup(this.essSilentTokenRequest)
        .then(response => {
          this.exchangeSetCreationResponse(this.selectedEncList);
        });
    });
  }
}
