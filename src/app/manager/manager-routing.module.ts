import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from "@app/manager/containers";

const routes: Routes = [
  {
    path: '',
    component: fromContainers.ManagerHomeComponent,
    children: [
      {
        path: 'devices',
        component: fromContainers.DeviceListComponent,
      },
      {
        path: 'users',
        component: fromContainers.UserListComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
