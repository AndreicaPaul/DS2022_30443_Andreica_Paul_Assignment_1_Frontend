import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from "@app/user/containers";
import {UserGuard} from "@app/core/guards";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    canActivate: [UserGuard]
  },
  {
    path: 'home',
    component: fromContainers.UserHomeComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'restaurant/:id',
    component: fromContainers.ViewDeviceComponent,
    canActivate: [UserGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
