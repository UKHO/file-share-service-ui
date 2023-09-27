import { FormsModule } from '@angular/forms';
//import { DialogueModule, CardModule, ButtonModule, TextinputModule, FileInputModule, RadioModule, RadioGroupModule, TableModule, CheckboxModule } from '@ukho/design-system';
import { TableModule } from '../../shared/components/ukho-table/table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file.component';
import { EssAddSingleEncsComponent } from './ess-add-single-encs/ess-add-single-encs.component';
import { EssListEncsComponent } from './ess-list-encs/ess-list-encs.component';
import { EssDownloadExchangesetComponent } from './ess-download-exchangeset/ess-download-exchangeset.component';
import { EssInfoErrorMessageComponent } from './ess-info-error-message/ess-info-error-message.component';
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSync, faX, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    ExchangeSetComponent,
    EssUploadFileComponent,
    EssAddSingleEncsComponent,
    EssListEncsComponent,
    EssDownloadExchangesetComponent,
    EssInfoErrorMessageComponent
  ],
  imports: [
    CommonModule,
    ExchangeSetRoutingModule,
    FormsModule,
    TableModule,
    /*CheckboxModule,*/
    FontAwesomeModule,
    DesignSystemModule,
  ]
})
export class ExchangeSetModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faSync, faX, faCircleNotch);
  }
}
