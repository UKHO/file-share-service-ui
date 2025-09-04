import { ExchangeSetApiService } from './../../../core/services/exchange-set-api.service';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { EssUploadFileService } from '../../../core/services/ess-upload-file.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';
import { SortState } from '../../../shared/components/ukho-table/tables.types';
import { Router } from '@angular/router';
import { ExchangeSetDetails, NotReturnedProduct, Product, ProductVersionRequest } from '../../../core/models/ess-response-types';
import { EssInfoErrorMessageService } from '../../../core/services/ess-info-error-message.service';

interface MappedEnc {
  enc: Product;
  selected: boolean;
}
enum SelectDeselect {
  select = 'Select all',
  deselect = 'Deselect all'
};

@Component({
  selector: 'app-ess-list-encs',
  templateUrl: './ess-list-encs.component.html',
  styleUrls: ['./ess-list-encs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EssListEncsComponent implements OnInit, OnDestroy {
  displayLoader: boolean = false;
  addSingleEncRenderFrom: string = 'encList';
  addSingleEncBtnText: string = 'Add ENC';
  encList: MappedEnc[];
  public displayedColumns = ['enc', 'Choose'];
  maxEncSelectionLimit: number;
  @ViewChild('ukhoTarget') ukhoDialog: ElementRef;
  selectedEncList: Product[];
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
  sortGraphicUp: string = "fa-chevron-up";
  sortGraphicDown: string = "fa-chevron-down";
  sortGraphic: string = this.sortGraphicUp;
  scsInvalidProduct: NotReturnedProduct[];
  updateNumber: number;
  editionNumber: number;
  isPrivilegedUser: boolean = false;
  selectedOption: string = 'S63';
  s57OptionValue: string = 'S57';
  s63OptionValue: string = 'S63';

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
    if (this.essUploadFileService.scsProductResponse) {
      this.essUploadFileService.scsProducts = this.essUploadFileService.scsProductResponse.products;
      this.scsInvalidProduct = this.essUploadFileService.scsProductResponse.productCounts.requestedProductsNotReturned;
    }
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
    this.essUploadFileService.exchangeSetDownloadZipType = this.s63OptionValue;

    if (this.scsInvalidProduct && this.scsInvalidProduct.length > 0) {
      let invalidProducts = this.scsInvalidProduct.map(obj => obj.productName).join(', ');
      this.triggerInfoErrorMessage(true, 'warning', `Invalid cells -  ${invalidProducts}`);
    }
    this.isPrivilegedUser = this.essUploadFileService.isPrivilegedUser;
  }

  setEncList() {
    this.encList = this.essUploadFileService.scsProducts.map((enc) => ({
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
  handleChange(enc: Product, event?: Event | null) {
    const seletedEncs: Product[] = this.essUploadFileService.getSelectedENCs();
    this.triggerInfoErrorMessage(false, 'info', '');
    if (seletedEncs.some((product) => product.productName === enc.productName)) {
      this.essUploadFileService.removeSelectedEncs(enc.productName);
      this.selectDeselectEncAlert = enc.productName + ' Remove From Selected List';
    } else if (this.maxEncSelectionLimit > seletedEncs.length) {
      this.essUploadFileService.addSelectedEnc(enc);
      this.selectDeselectEncAlert = enc.productName + ' Added From Selected List';
    } else {
      const currCheckedElement = (document.querySelector(`ukho-checkbox[aria-label=${enc.productName}] input`) as HTMLElement);
      if (currCheckedElement) {
        currCheckedElement.click(); // will uncheck the selected checkbox
      }
      this.triggerInfoErrorMessage(true, 'error', 'No more than ' + this.maxEncSelectionLimit + ' ENCs can be selected');
      return;
    }
    this.syncEncsBetweenTables();
    setTimeout(() => {
      const element = document.querySelector(`admiralty-checkbox[aria-label=${enc.productName}] input`) as HTMLElement;
      if (element && event) {
        element.focus();
      }
    }, 5);
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
      this.selectedOption = this.s63OptionValue;
      this.selectDeselectText = SelectDeselect.select;
      return;
    }
    if (this.selectDeselectText === SelectDeselect.select && this.checkMaxEncSelectionAndSelectedEncLength()) {
      this.selectDeselectText = SelectDeselect.deselect;
      return;
    }
  }

  onSortChange(sortState: SortState) {
    if (sortState.direction === 'asc') {
      this.sortGraphic = this.sortGraphicUp;
    }
    else {
      this.sortGraphic = this.sortGraphicDown;
    }
    this.encList = [
      ...this.encList.sort((a: any, b: any) =>
        sortState.direction === 'asc'
          ? a[sortState.column].productName.localeCompare(b[sortState.column].productName)
          : b[sortState.column].productName.localeCompare(a[sortState.column].productName)
      ),
    ];
  }

  switchToESSLandingPage() {
    this.route.navigate(['exchangesets']);
  }

  displaySingleEnc() {
    this.displaySingleEncVal = true;
    setTimeout(() => {
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
          this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
        }
      );
    }
  }

  getEstimatedTotalSize() {
    if (this.selectedEncList && this.selectedEncList.length > 0) {
      return this.essUploadFileService.getEstimatedTotalSize();
    }
    else {
      return '0 MB';
    }
  }

  getSelectDeselectText() {
    const selectDeselectText = this.checkMaxEncSelectionAndSelectedEncLength() ? SelectDeselect.deselect : SelectDeselect.select;
    return selectDeselectText;
  }

  checkMaxEncSelectionAndSelectedEncLength() {
    const listLength = this.encList.length;
    const maxEncSelectionLimit = this.maxEncSelectionLimit > listLength ? listLength : this.maxEncSelectionLimit;
    return maxEncSelectionLimit === this.selectedEncList.length;

  }

  selectDeselectAll() {
    this.triggerInfoErrorMessage(false, 'error', '');
    if (!this.checkMaxEncSelectionAndSelectedEncLength() && this.selectDeselectText === SelectDeselect.select) {
      this.selectDeselectAlert = 'Selected All ENC\'s';
      this.essUploadFileService.addAllSelectedEncs();
    } else {
      this.selectDeselectAlert = 'DeSelected All ENC\'s';
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
      this.scsExchangeSetResponse();
    }, error => {
      this.msalService.instance
        .loginPopup(this.essSilentTokenRequest)
        .then(response => {
          this.scsExchangeSetResponse();
        });
    });
  }

  essDownloadZipType(option: string) {
    this.essUploadFileService.exchangeSetDownloadZipType = option === this.s57OptionValue ? this.s57OptionValue : this.s63OptionValue;
  }

  scsExchangeSetResponse() {
    if (this.essUploadFileService.exchangeSetDownloadType == 'Delta') {
      var productVersionRequest: ProductVersionRequest[] = [];
      for (let selectedEnc of this.selectedEncList) {
        this.editionNumber = selectedEnc.editionNumber;
        this.updateNumber = Math.min(...selectedEnc.updateNumbers);
        if (this.updateNumber == 0) {
          this.editionNumber = this.editionNumber != 0 ? this.editionNumber - 1 : this.editionNumber;
        } else {
          this.updateNumber = this.updateNumber - 1;
        }
        var productVersion: ProductVersionRequest = {
          productName: selectedEnc.productName,
          editionNumber: this.editionNumber,
          updateNumber: this.updateNumber
        };
        productVersionRequest.push(productVersion);
      }
      this.exchangeSetCreationForDeltaResponse(productVersionRequest);
    }
    else {
      const selectedEncList: string[] = this.selectedEncList.map(product => product.productName);
      this.exchangeSetCreationResponse(selectedEncList);
    }
  }

  exchangeSetCreationForDeltaResponse(selectedEncList: ProductVersionRequest[]) {
    this.displayLoader = true;
    if (selectedEncList != null) {
      this.exchangeSetApiService.exchangeSetCreationForDeltaResponse(selectedEncList).subscribe((result) => {
        this.displayLoader = false;
        this.exchangeSetDetails = result;
        this.essUploadFileService.setExchangeSetDetails(this.exchangeSetDetails);
        this.route.navigate(['exchangesets', 'enc-download']);
      },
        (error) => {
          this.displayLoader = false;
          this.triggerInfoErrorMessage(true, 'error', 'There has been an error');
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.triggerInfoErrorMessage(false, 'info', '');
    this.triggerInfoErrorMessage(false, 'error', '');
    this.triggerInfoErrorMessage(false, 'warning', '');
  }
}
