import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-set',
  templateUrl: './exchange-set.component.html',
  styleUrls: ['./exchange-set.component.scss'],
})

export class ExchangeSetComponent implements OnInit {

  constructor() {
   }

   rdoUploadFileName="Upload your whole permit file or a .csv file";
   rdoUploadFileId:any;
   rdoAddSingleFileName="Add ENCs";
   rdoAddSingleFileId:any=false;
   chkESSUpload:boolean=false;
   chkAddSingleENCs:boolean=false;
   
  ngOnInit(): void {
  }

  onChange(UploadENCs:any) {
    if(UploadENCs.target.value==='rdoUploadFileName')
    {
       this.chkESSUpload=true;
       this.chkAddSingleENCs=false;
    }
    if(UploadENCs.target.value==='rdoAddSingleFileName')
    {
      this.chkAddSingleENCs=true;
      this.chkESSUpload=false;  
    }
  };

}
