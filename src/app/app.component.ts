import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  currentUrl: any = '';

  isOverlay:boolean = false;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private msalService: MsalService
  ) { 
  
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url != '') {
          this.currentUrl = e.url;
        } else {
          this.currentUrl ='';
        }

      }
      
    });
  }

  @HostListener('window:unload', ['$event'])
  unloadhandler() {
    this.msalService.logout();
  }

  ngOnInit() {
    this.msalService.instance.initialize();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }
          return null;
        })).subscribe((title: any) => {
          this.titleService.setTitle(title);
        });
  }

  changeOverlay(pageOverlay:any){
    this.isOverlay = pageOverlay;
  }
}
