// import { FssSearchComponent } from './../components/fss-search/fss-search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FssSearchComponent } from './fss-search.component';


const routes: Routes = [
  { path: '', component: FssSearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FssSearchRoutingModule { }
