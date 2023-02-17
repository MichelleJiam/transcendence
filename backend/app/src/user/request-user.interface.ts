import { User } from "./user.entity";
import { Request } from "express";

export interface RequestUser extends Request {
  user: User;
}
