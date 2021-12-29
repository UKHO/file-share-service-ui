import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputModule,CardModule, DialogueModule } from '@ukho/design-system';
import { EssUiRoutingModule } from './ess-ui-routing.module';
import { EssUiComponent } from './ess-ui.component';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';


@NgModule({
  declarations: [
    EssUiComponent,
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
