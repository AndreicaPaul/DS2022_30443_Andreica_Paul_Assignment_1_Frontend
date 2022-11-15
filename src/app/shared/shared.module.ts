import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TextMaskModule } from 'angular2-text-mask';

import { MaterialModule } from '@app/shared/modules/material/material.module';

import * as fromComponents from './components';
import * as fromPipes from './pipes';
import {AgGridModule} from "ag-grid-angular";

@NgModule({
  declarations: [...fromComponents.components, ...fromPipes.pipes],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        TextMaskModule,
        AgGridModule,
        FormsModule,
    ],
  exports: [
    AgGridModule,
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
