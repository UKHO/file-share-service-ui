import { EssListEncsComponent } from './ess-upload-results/ess-list-encs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeSetComponent } from './exchange-set.component';

const routes: Routes = [{ path: '', component: ExchangeSetComponent },
{ path: 'enc-list', component: EssListEncsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
