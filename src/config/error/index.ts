import { Response, Request } from 'express';
import { AppError } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  error: AppError,
  _req: Request,
  res: Response
) {
  try {
    const code = error.code || 500;
    const msg = error.message;

    console.log(error.name || 'Error', error.message);
    return res.status(code || 500).json({
      status: false,
      message: msg
    });
  } catch (e) {
    return res
      .status(500)
      .json({
        status: false,
      });
  }
}