import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeSetComponent } from './exchange-set.component';

const routes: Routes = [{ path: '', component: ExchangeSetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
