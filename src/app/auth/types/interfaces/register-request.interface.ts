import {UserType} from "@app/auth/types/enums/user-type.enum";

export interface RegisterRequest {
  email : string;
  username : string;
  password : string;
  userRole: UserType;
}
