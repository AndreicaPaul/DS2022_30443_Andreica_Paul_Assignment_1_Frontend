import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TextMaskModule } from 'angular2-text-mask';

import { MaterialModule } from '@app/shared/modules/material/material.module';

import * as fromComponents from './components';
import * as fromPipes from './pipes';

@NgModule({
  declarations: [...fromComponents.components, ...fromPipes.pipes],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TextMaskModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ...fromComponents.components,
    ...fromPipes.pipes
  ],
  providers: [DatePipe, ...fromPipes.pipes]
})
export class SharedModule {}
