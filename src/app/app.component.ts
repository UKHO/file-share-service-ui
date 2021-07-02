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
    const height = document.body.offsetHeight;
    this.isOverlay = pageOverlay;
    if(this.isOverlay === true){
      var element = document.getElementById('overlay');
      element!.style.height = height + 'px';
    }
    else{
      var element = document.getElementById('overlay');
      element!.style.height = 0 + 'px';
    }
  }
}
