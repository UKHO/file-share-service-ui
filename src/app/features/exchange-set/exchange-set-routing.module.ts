import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssUploadFileComponent } from './ess-upload-file/ess-upload-file/ess-upload-file.component';
import { ExchangeSetComponent } from './exchange-set.component';
import { SingleEncDisplayComponent } from './single-enc-display/single-enc-display.component';

const routes: Routes = [{ path: '', component: ExchangeSetComponent },
                        {path:'AddEnc',component:SingleEncDisplayComponent},
                        {path:'StartAgain',component:ExchangeSetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeSetRoutingModule { }
