import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CatchErr } from '../../types';
import { validationResult } from 'express-validator';

export const validate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    throw catchError(
      'Validation failed',
      400, errors.mapped()
    );
  } catch (e) {
    return next(e);
  }
};

export const success = (message: string, data: object) => {
  return {
    message,
    success: true,
    data
  };
};

export const AuthenticateRequest = (p: object) => {
  const token = jwt.sign({ ...p }, process.env.SECRET || "");
  if (!token) throw catchError("Error Authenticating your request", 400);
  return token;
};

export const catchError: CatchErr = (message, code = 403, validations = {}) => {
  const err = new Error(message);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  err.code = code;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  err.validations = validations;
  return err;
};