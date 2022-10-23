import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';

@NgModule({
  declarations: [...fromComponents.components, ...fromContainers.containers],
  imports: [SharedModule, AuthRoutingModule],
  providers: [...fromServices.services]
})
export class AuthModule {}
