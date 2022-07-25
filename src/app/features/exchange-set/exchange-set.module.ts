import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeSetRoutingModule } from './exchange-set-routing.module';
import { ExchangeSetComponent } from './exchange-set.component';


@NgModule({
  declarations: [
    ExchangeSetComponent
  ],
  imports: [
    CommonModule,
    ExchangeSetRoutingModule
  ]
})
export class ExchangeSetModule { }
