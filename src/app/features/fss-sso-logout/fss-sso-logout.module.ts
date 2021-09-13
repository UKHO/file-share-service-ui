import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FssSsoLogoutRoutingModule } from './fss-sso-logout-routing.module';
import { FssSsoLogoutComponent } from './fss-sso-logout.component';


@NgModule({
  declarations: [
    FssSsoLogoutComponent
  ],
  imports: [
    CommonModule,
    FssSsoLogoutRoutingModule
  ]
})
export class FssSsoLogoutModule { }
