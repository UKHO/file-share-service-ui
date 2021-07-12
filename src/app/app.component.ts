import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  isOverlay:boolean = false;

  constructor(){}

  ngOnInit(){
  }
  changeOverlay(pageOverlay:any){
    this.isOverlay = pageOverlay;
  }
}
