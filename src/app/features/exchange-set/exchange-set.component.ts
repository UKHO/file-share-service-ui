import { Component, OnInit } from '@angular/core';
import { FileShareApiService } from 'src/app/core/services/file-share-api.service';

@Component({
  selector: 'app-exchange-set',
  templateUrl: './exchange-set.component.html',
  styleUrls: ['./exchange-set.component.scss'],
})

export class ExchangeSetComponent implements OnInit {

  constructor(private fileShareApiService: FileShareApiService) {
   }

  rgAddUploadENC: string;  
  radioUploadEncValue:string;
  radioAddEncValue:string;
   
  ngOnInit(): void {
    this.radioUploadEncValue="UploadEncFile";
    this.radioAddEncValue="AddSingleEnc";
    this.fileShareApiService.uploadEnc().subscribe((result) => {
      console.log(result);
    });
  }

}
