import { Component, OnInit } from '@angular/core';
import { EssUploadFileService } from 'src/app/core/services/ess-upload-file.service';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent implements OnInit {
  validEncList: string[];
  constructor(private essUploadFileService: EssUploadFileService) { }

  ngOnInit(): void {
    this.validEncList = this.essUploadFileService.getValidEncs();
  }

  ngOnChanges(): void {
    this.validEncList = this.essUploadFileService.getValidEncs();
  }

}
