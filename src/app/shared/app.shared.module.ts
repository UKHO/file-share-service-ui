import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DesignSystemModule } from '@ukho/admiralty-angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({ declarations: [
        FssHeaderComponent,
        FssPhaseBannerComponent,
        FssFooterComponent
    ],
    exports: [
        FssHeaderComponent, FssPhaseBannerComponent, FssFooterComponent
    ], imports: [BrowserModule, ReactiveFormsModule, DesignSystemModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })

export class SharedModule { }
