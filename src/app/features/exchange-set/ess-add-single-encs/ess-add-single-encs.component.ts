import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  placeholder:string="Type ENC cell name here";
  
  constructor() { }

  ngOnInit(): void {
  }
  
}
