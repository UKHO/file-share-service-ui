import { EssUploadResultsComponent } from './ess-upload-results/ess-upload-results.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeSetComponent } from './exchange-set.component';

const routes: Routes = [{ path: '', component: ExchangeSetComponent },
{ path: 'list-encs', component: EssUploadResultsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
