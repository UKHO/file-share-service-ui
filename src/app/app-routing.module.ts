import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./features/fss-home/fss-home.module').then(m => m.FssHomeModule) 
  },
  { 
    path: 'search', 
    loadChildren: () => import('./features/fss-search/fss-search.module').then(m => m.FssSearchModule),
    canActivate: [MsalGuard] 
  }
];
const isIframe = window !== window.parent && !window.opener;
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Don't perform initial navigation in iframes
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
