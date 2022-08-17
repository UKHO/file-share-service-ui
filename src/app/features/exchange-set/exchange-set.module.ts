import { FormsModule } from '@angular/forms';
import { DialogueModule, CardModule, ButtonModule, TextinputModule, FileInputModule, RadioModule, RadioGroupModule, TableModule, CheckboxModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file/ess-upload-file.component';
import { EssAddSingleEncsComponent } from './ess-add-single-encs/ess-add-single-encs.component';
import { EssListEncsComponent } from './ess-list-encs/ess-list-encs.component';

@NgModule({
  declarations: [
    ExchangeSetComponent,
    EssUploadFileComponent,
    EssAddSingleEncsComponent,
    EssListEncsComponent
  ],
  imports: [
    CommonModule,
    ExchangeSetRoutingModule,
    DialogueModule,
    CardModule,
    ButtonModule,
    TextinputModule,
    RadioModule,
    FileInputModule,
    RadioGroupModule,
    FormsModule,
    TableModule,
    CheckboxModule
  ]
})
export class ExchangeSetModule { }
