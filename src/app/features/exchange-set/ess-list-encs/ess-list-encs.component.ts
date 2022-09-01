import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SortState } from '@ukho/design-system';
import { Router } from '@angular/router';
import { SilentRequest } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { ExchangeSetApiService } from '../../../core/services/exchange-set-api.service';
import { ExchangeSetDetails, ExchangeSetLinks } from 'src/app/core/models/ess-response-types';
import { stringOperatorList } from 'Helper/ConstantHelper';

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
  messageType: 'info' | 'warning' | 'success' | 'error' = 'info';
  messageDesc = '';
  displayErrorMessage = false;
  maxEncSelectionLimit: number;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: string[];
  displaySingleEncVal: boolean = false;
  public displaySelectedTableColumns = ['enc', 'X'];
  selectDeselectText: string;
  showSelectDeselect: boolean;
  essTokenScope: any = [];
  essSilentTokenRequest: SilentRequest;
  exchangeSetDetails: ExchangeSetDetails;

  constructor(private essUploadFileService: EssUploadFileService,
    private route: Router,
    private msalService: MsalService,
    private exchangeSetApiService: ExchangeSetApiService,
  ) {
    this.essTokenScope = AppConfigService.settings["fssConfig"].apiScope;
    this.essSilentTokenRequest = {
      scopes: [this.essTokenScope],
    };
  }

  ngOnInit(): void {
    this.displayErrorMessage = this.essUploadFileService.infoMessage;
    this.maxEncSelectionLimit = Number.parseInt(
      AppConfigService.settings['essConfig'].MaxEncSelectionLimit,
      10
    );
    this.essUploadFileService.clearSelectedEncs();
    if (this.displayErrorMessage) {
      this.showMessage('info', 'Some values have not been added to list.');
    }
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
    this.displayErrorMessage = false;
    if (seletedEncs.includes(enc)) {
      this.essUploadFileService.removeSelectedEncs(enc);
    } else if (this.maxEncSelectionLimit > seletedEncs.length) {
      this.essUploadFileService.addSelectedEnc(enc);
    } else {
      this.showMessage(
        'error',
        'No more than ' + this.maxEncSelectionLimit + ' ENCs can be selected.'
      );
      window.scrollTo(0,0);
    }
    this.syncEncsBetweenTables();
  }

  syncEncsBetweenTables() {
    this.selectedEncList = this.essUploadFileService.getSelectedENCs();
    this.encList = this.encList.map((item, index) => ({
      enc: item.enc,
      selected: this.selectedEncList.includes(item.enc) ? true : false,
    }));
    this.showSelectDeselect = this.getSelectDeselectVisibility();
    if(this.selectedEncList.length === 0){
      this.selectDeselectText = SelectDeselect.select;
      return;
    }
    if(this.selectDeselectText === SelectDeselect.select && this.checkMaxEncSelectionAndSelectedEncLength()){
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
    this.route.navigate(["exchangesets"]);
  }

  displaySingleEnc() {
    this.displaySingleEncVal = true;
  }
  getSelectDeselectText(){
    const selectDeselectText = this.checkMaxEncSelectionAndSelectedEncLength() ? SelectDeselect.deselect : SelectDeselect.select;
    return selectDeselectText;
  }
  checkMaxEncSelectionAndSelectedEncLength(){
    const maxEncSelectionLimit = this.maxEncSelectionLimit > this.encList.length ? this.encList.length  : this.maxEncSelectionLimit;
    return maxEncSelectionLimit === this.selectedEncList.length;
  }
  selectDeselectAll(){
    if(!this.checkMaxEncSelectionAndSelectedEncLength() && this.selectDeselectText === SelectDeselect.select){
      this.essUploadFileService.addAllSelectedEncs();
    }else{
      this.essUploadFileService.clearSelectedEncs();
    }
    this.syncEncsBetweenTables();
    this.selectDeselectText = this.getSelectDeselectText();
  }

  getSelectDeselectVisibility(){
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
        })
    })
  }

  exchangeSetCreationResponse(selectedEncList: any[]) {
    if (selectedEncList != null) {
      this.exchangeSetApiService.exchangeSetCreationResponse(selectedEncList).subscribe((result) => {
        this.displayLoader = false;
        this.exchangeSetDetails = result;
        this.essUploadFileService.setExchangeSetDetails(this.exchangeSetDetails);
        this.route.navigate(['exchangesets', 'enc-download']);
      },
        (error) => {
          this.showMessage('error', 'There has been an error');
          this.displayLoader = false;
        }
      );
    }
  }

}
