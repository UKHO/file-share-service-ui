import { FileInputModule } from '@ukho/design-system';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssUiParseRoutingModule } from './ess-ui-parse-routing.module';
import { EssUiParseComponent } from './ess-ui-parse.component';


@NgModule({
  declarations: [
    EssUiParseComponent
  ],
  imports: [
    CommonModule,
    EssUiParseRoutingModule,
    FileInputModule
  ]
})
export class EssUiParseModule { }
