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
    ExchangeSetRoutingModule
  ]
})
export class ExchangeSetModule { }
