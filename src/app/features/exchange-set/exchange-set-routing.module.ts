import { EssDownloadExchangesetComponent } from './ess-download-exchangeset/ess-download-exchangeset.component';
import { EssListEncsComponent } from './ess-list-encs/ess-list-encs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeSetComponent } from './ess-input-types/exchange-set.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { EssTypesComponent } from './ess-types/ess-types.component';
const routes: Routes = [
  { path: '', component: EssTypesComponent },
  { path: 'enc-list', component: EssListEncsComponent , canActivate : [AuthGuard]},
  { path: 'enc-download', component: EssDownloadExchangesetComponent, canActivate : [AuthGuard]},
  { path: 'exchange-set', component: ExchangeSetComponent , canActivate : [AuthGuard]} 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
