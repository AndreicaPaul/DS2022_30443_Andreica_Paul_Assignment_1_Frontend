import {AuthGuard} from "@app/core/guards/auth.guard";
import {AdminGuard} from "@app/core/guards/admin.guard";
import {UserGuard} from "@app/core/guards/user.guard";

export const guards = [AuthGuard, AdminGuard, UserGuard];

export * from './auth.guard';
export * from './admin.guard';
export * from './user.guard';
