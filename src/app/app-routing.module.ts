import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FssHomeComponent } from './features/fss-home/fss-home.component';
const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./features/fss-home/fss-home.module').then(m => m.FssHomeModule),
    data: {title: 'Admiralty - File Share Service'} 
  },
  { 
    path: 'search', 
    loadChildren: () => import('./features/fss-search/fss-search.module').then(m => m.FssSearchModule),
    data: {title: 'Admiralty - File Share Service - Search'}
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
  { path: 'accessibility',
    loadChildren: () => import('./features/accessibility/accessibility.module').then(m => m.AccessibilityModule),
    data: {title: 'Admiralty - File Share Service - Accessibility'}
  },
  {
   path: 'logout',
   loadChildren: () => import('./features/fss-sso-logout/fss-sso-logout.module').then(m => m.FssSsoLogoutModule)
  },
  { path: 'exchangesets', 
    loadChildren: () => import('./features/exchange-set/exchange-set.module').then(m => m.ExchangeSetModule) 
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
    initialNavigation: isIframe ? 'disabled' : 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
