import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EssAddSingleEncService {
  public AllEncList: string = '';

      EncListSource = new  BehaviorSubject(this.AllEncList);
  
     currentEncList = this.EncListSource.asObservable();



  PatternValidator():ValidatorFn{
    return (control:AbstractControl):{ [ key: string ]: any }=> {
      if(!control.value){
        return null!;
      }
      const regex = new RegExp('[A-Z]{2}[1-68][A-Z0-9]{5}$');
      const valid = regex.test(control.value);
      return valid ? null! : { invalidEnc : true};
    };
  }
  uploadedEncList(enc:string) {
      console.log(enc);
         this.EncListSource.next(enc)
             
       }
       getsingleenc():Observable<string>{
        return this.EncListSource.asObservable();
       }
  constructor() { }


  
}
