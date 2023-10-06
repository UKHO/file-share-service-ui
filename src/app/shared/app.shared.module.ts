import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { HttpClientModule } from '@angular/common/http';
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssPhaseBannerComponent,
    FssFooterComponent
  ],

  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule, DesignSystemModule.forRoot(),
    //MsalConfigDynamicModule.forRoot('assets/config/appconfig.json')
  ],
  providers:[],

  exports: [
    FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
  ]
})

export class SharedModule { }
