import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssUiParseComponent } from './ess-ui-parse.component';

const routes: Routes = [{ path: '', component: EssUiParseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssUiParseRoutingModule { }
