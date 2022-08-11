import { EssUploadResultsComponent } from './ess-upload-results/ess-upload-results.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeSetComponent } from './exchange-set.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';
const routes: Routes = [
  { path: '', component: ExchangeSetComponent },
  { path: 'enc-list', component: EssUploadResultsComponent , canActivate : [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
