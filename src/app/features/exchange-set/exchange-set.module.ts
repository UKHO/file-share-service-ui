import { FormsModule } from '@angular/forms';
import { DialogueModule, CardModule, ButtonModule, TextinputModule, CheckboxModule, FileInputModule, RadioModule, RadioGroupModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file/ess-upload-file.component';
import { EssAddSingleEncsComponent } from './ess-add-single-encs/ess-add-single-encs.component';


@NgModule({
  declarations: [
    ExchangeSetComponent,
    EssUploadFileComponent,
    EssAddSingleEncsComponent
  ],
  imports: [
    CommonModule,
    ExchangeSetRoutingModule,
    DialogueModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    TextinputModule,
    RadioModule,
    FileInputModule,
    RadioGroupModule,
    FormsModule
  ]
})
export class ExchangeSetModule { }
