import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputModule,CardModule, DialogueModule } from '@ukho/design-system';
import { EssUiRoutingModule } from './ess-ui-routing.module';
import { EssUiComponent } from './ess-ui.component';
import { FileDragNDropDirective } from './ess-ui-exchangeset-request/file-drag-n-drop.directive';
import { EssUiExchangesetRequestComponent } from './ess-ui-exchangeset-request/ess-ui-exchangeset-request.component';


@NgModule({
  declarations: [
    EssUiComponent,
    EssUiExchangesetRequestComponent,
    FileDragNDropDirective
  ],
  imports: [
    CommonModule,
    EssUiRoutingModule,
    FileInputModule,
    CardModule,
    DialogueModule
  ]
})
export class EssUiModule { }
