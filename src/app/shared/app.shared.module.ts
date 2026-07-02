import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '@ukho/admiralty-angular';
//import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FssHeaderComponent, FssFooterComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FssHeaderComponent,
    FssFooterComponent
  ],
  exports: [
    FssHeaderComponent,
    FssFooterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DesignSystemModule.forRoot()
  ], //providers: [provideHttpClient(withInterceptorsFromDi())]
})

export class SharedModule { }
