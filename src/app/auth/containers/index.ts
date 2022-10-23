import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from '@app/auth/containers/login/login.component';
import { RegisterComponent } from '@app/auth/containers/register/register.component';

export const containers = [
  AuthComponent,
  LoginComponent,
  RegisterComponent,
];

export * from './auth/auth.component';
export * from './login/login.component';
export * from './register/register.component';
