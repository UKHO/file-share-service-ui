import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputModule,CardModule, DialogueModule } from '@ukho/design-system';
import { EssUiRoutingModule } from './ess-ui-routing.module';
import { EssUiComponent } from './ess-ui.component';


@NgModule({
  declarations: [
    EssUiComponent
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
