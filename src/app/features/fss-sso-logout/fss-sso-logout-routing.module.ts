import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FssSsoLogoutComponent } from './fss-sso-logout.component';

const routes: Routes = [{ path: '', component: FssSsoLogoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FssSsoLogoutRoutingModule { }
