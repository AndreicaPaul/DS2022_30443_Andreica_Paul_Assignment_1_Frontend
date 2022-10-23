import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuard, AuthGuard, UserGuard} from "@app/core/guards";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@app/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'manager',
    loadChildren: () => import('@app/manager/manager.module').then(m => m.ManagerModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('@app/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
