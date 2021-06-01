import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FssHomeComponent } from './fss-home.component';

const routes: Routes = [{ path: '', component: FssHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FssHomeRoutingModule { }
