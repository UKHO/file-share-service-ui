import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file/ess-upload-file.component';
import { EssAddSingleEncsComponent } from './ess-add-single-encs/ess-add-single-encs.component';
import { RadioModule,TextinputModule,ButtonModule,FileInputModule,RadioGroupModule } from '@ukho/design-system';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ExchangeSetComponent,
    EssUploadFileComponent,
    EssAddSingleEncsComponent
  ],
  imports: [
    CommonModule,
    ExchangeSetRoutingModule,
    RadioModule,
    TextinputModule,
    ButtonModule,
    FileInputModule,
    RadioGroupModule,
    FormsModule
  ]
})
export class ExchangeSetModule { }
