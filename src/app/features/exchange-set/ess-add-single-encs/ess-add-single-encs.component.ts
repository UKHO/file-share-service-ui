import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EssAddSingleEncService } from 'src/app/core/services/ess-add-single-enc.service';
import { EssUploadFileService } from 'src/app/core/services/ess-upload-file.service';

@Component({
  selector: 'app-ess-add-single-encs',
  templateUrl: './ess-add-single-encs.component.html',
  styleUrls: ['./ess-add-single-encs.component.scss']
})
export class EssAddSingleEncsComponent implements OnInit {
  txtSingleEnc: string = "";
Form:FormGroup;
submitted=false;
  constructor(private essAddSingleEncService:EssAddSingleEncService,private fb:FormBuilder,private router: Router, 
    private activatedRoute: ActivatedRoute,private essuploadenc:EssUploadFileService) { }

  ngOnInit(): void {
    this.Form=this.fb.group({
      EncADD:['',Validators.compose([Validators.required,this.essAddSingleEncService.PatternValidator()])]
    });
  }

  Submit() {
    this.submitted=true;
    this.txtSingleEnc=this.Form.value.EncADD;
    console.log(this.txtSingleEnc) 
        this.essuploadenc.setValidSingleEnc(this.txtSingleEnc);
        this.router.navigate(['exchangesets', 'AddEnc']);
      }
      get registerFormControl(){
        return this.Form.controls;
        
       }
  }
  
