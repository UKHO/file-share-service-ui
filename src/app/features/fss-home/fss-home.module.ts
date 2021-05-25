import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FssHomeRoutingModule } from './fss-home-routing.module';
import { FssHomeComponent } from './fss-home.component';
import { CardModule,ButtonModule} from '@ukho/design-system';


@NgModule({
  declarations: [
    FssHomeComponent
  ],
  imports: [
    CommonModule,
    FssHomeRoutingModule,
    CardModule,
    ButtonModule
  ]
})
export class FssHomeModule { }
