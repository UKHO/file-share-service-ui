import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FssHomeComponent } from './features/fss-home/fss-home.component';
const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./features/fss-home/fss-home.module').then(m => m.FssHomeModule) 
  },
  { 
    path: 'search', 
    loadChildren: () => import('./features/fss-search/fss-search.module').then(m => m.FssSearchModule)
  },
  {
    // Needed for hash routing
    path: 'error',
    component: FssHomeComponent
  },
  {
    // Needed for hash routing
    path: 'state',
    component: FssHomeComponent
  },
  {
    // Needed for hash routing
    path: 'code',
    component: FssHomeComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
const isIframe = window.opener && window !== window.opener

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
    initialNavigation: isIframe ? 'disabled' : 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
