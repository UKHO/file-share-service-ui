import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EssAddSingleEncService } from 'src/app/core/services/ess-add-single-enc.service';
import { EssUploadFileService } from 'src/app/core/services/ess-upload-file.service';
interface Iencs{
  enc:string;
  
}
@Component({
  selector: 'app-single-enc-display',
  templateUrl: './single-enc-display.component.html',
  styleUrls: ['./single-enc-display.component.scss']
})
export class SingleEncDisplayComponent implements OnInit {
  //validEnc=this.activateRoute.snapshot.queryParamMap.get('NewEnc');
  validEnc:Iencs[];
  subcription:Subscription;
  public displayedColumns = ['EncName','Choose'];

  
  constructor(private addSingleSevice:EssAddSingleEncService,private essuploadenc:EssUploadFileService) {
 
    
   }

  ngOnInit(): void {
 //this.addSingleSevice.currentEncList.subscribe((encList)=>{
  this.validEnc=this.essuploadenc.getValidEncs().map((enc:any)=>{return {enc}});
   console.log(this.validEnc)
   //this.validEnc = encList
  //   })
  //  // this.validEnc=this.addSingleSevice.getsingleenc();
  //   console.log(this.validEnc)
  }

}
