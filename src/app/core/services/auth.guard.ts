import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { EssUploadFileService } from './ess-upload-file.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  routes = ['/search' , '/exchangesets' ];
  childRoutes = ['/exchangesets/enc-list','/exchangesets/enc-download'];
 
  constructor(private msalService: MsalService,
    private router: Router,private essUploadFileService: EssUploadFileService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const account = this.msalService.instance.getActiveAccount();
      const encs = this.essUploadFileService.getValidEncs();   
      if(account && state.url === '/'){
        this.router.navigate(['search']);
        return false;
      }else if(account && this.childRoutes.includes(state.url)){
        if(encs && encs.length > 0){
          return true;
        }
        this.router.navigate(['exchangesets']);
        return false;
      }else if(account){
        return true;
      }else if(!account && (this.routes.includes(state.url) || this.childRoutes.includes(state.url))){
        this.router.navigate(['']);
        return false;
      }else if(!account && state.url === '/'){
        return true;
      }
      return false;
  }
}
