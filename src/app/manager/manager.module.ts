import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ManagerRoutingModule } from './manager-routing.module';

import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';
@NgModule({
    declarations: [
        ...fromComponents.components,
        ...fromContainers.containers,
    ],
    imports: [
        SharedModule, ManagerRoutingModule
    ],
    providers: [
        ...fromServices.services
    ]
})
export class ManagerModule { }
