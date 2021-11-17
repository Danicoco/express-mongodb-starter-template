/* eslint-disable no-unused-vars */
import { Request } from 'express';
// import { IUserModel } from './database/models';

interface AuthenticatedUser extends Request {
  user: Users
}

type CatchErr = (
  message: string,
  code?: number,
  validations?: object,
) => Error;

type AppError = Error & {
  code: number;
  name?: string;
  message: string;
  validations?: object | null;
};

interface Users {
  _id?: string;
  id: string;
  phoneNumber?: string;
  username?: string;
}

declare module "express-serve-static-core" {
  export interface Request {
    user: Users
  }
}