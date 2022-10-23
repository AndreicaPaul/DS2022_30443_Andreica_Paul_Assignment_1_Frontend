import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import * as fromGuards from './guards';
import {ApiInterceptor} from "@app/core/interceptors/api.interceptor";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    ...fromGuards.guards
  ],
  exports: [HttpClientModule]
})
export class CoreModule {}
