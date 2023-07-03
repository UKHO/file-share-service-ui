import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FssHomeRoutingModule } from './fss-home-routing.module';
import { FssHomeComponent } from './fss-home.component';
import { DesignSystemModule } from '@ukho/admiralty-angular';



@NgModule({
  declarations: [
    FssHomeComponent
  ],
  imports: [
    CommonModule,
    FssHomeRoutingModule,
    DesignSystemModule
  ]
})
export class FssHomeModule { }
