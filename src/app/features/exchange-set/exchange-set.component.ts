import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-set',
  templateUrl: './exchange-set.component.html',
  styleUrls: ['./exchange-set.component.scss']
})
export class ExchangeSetComponent implements OnInit {
  rgAddUploadENC: string;  
  radioUploadEncValue:string;
  radioAddEncValue:string;
  constructor() { }

  ngOnInit(): void {
    this.radioUploadEncValue="UploadEncFile";
    this.radioAddEncValue="AddSingleEnc";
  }

}
