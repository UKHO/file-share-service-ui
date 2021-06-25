import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./features/fss-home/fss-home.module').then(m => m.FssHomeModule) 
  },
  { 
    path: 'Search', 
    loadChildren: () => import('./features/fss-search/fss-search.module').then(m => m.FssSearchModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
