import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssUiComponent } from './ess-ui.component';

const routes: Routes = [{ path: '', component: EssUiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssUiRoutingModule { }
