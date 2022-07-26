import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private msalService: MsalService,
    private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const account = this.msalService.instance.getActiveAccount();
      if(!account){
         if(state.url === '/'){
          return true;
         }
        return false;
      }else if(account && state.url === '/'){
        this.router.navigate(['search']);
        return false;
      }
      return true;
  }
}
