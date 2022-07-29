import { DialogueModule, CardModule, ButtonModule, TextinputModule, CheckboxModule, FileInputModule, RadioModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file/ess-upload-file.component';


@NgModule({
  declarations: [
    ExchangeSetComponent,
    EssUploadFileComponent
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
    FileInputModule
  ]
})
export class ExchangeSetModule { }
