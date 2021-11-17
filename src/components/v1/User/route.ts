import { Router } from 'express';
import { userCredential, isGender, isFullName, isPassword } from './validation';
import {
  createAccount, updateGender, updateFullname,
  updatePassword, getProfile,
  signIn, resendOTP, verifyOTP, getAllUser,
} from './controller';
import { validate } from '../../../config/common/utils';
import { isAuthenticated } from '../../../config/middleware/jwtAuth';
const userRoute = Router();

userRoute.post(
  '/',
  userCredential,
  validate,
  createAccount
);

userRoute.get(
  '/',
  getAllUser
);

userRoute.post(
  '/signin',
  userCredential,
  validate,
  signIn
);

userRoute.post(
  '/gender',
  isAuthenticated,
  isGender,
  validate,
  updateGender
);

userRoute.post(
  '/full-name',
  isAuthenticated,
  isFullName,
  validate,
  updateFullname
);

userRoute.post(
  '/change-password',
  isAuthenticated,
  isPassword,
  validate,
  updatePassword
);

userRoute.post(
  '/resend-otp',
  resendOTP
);

userRoute.post(
  '/verify-otp',
  verifyOTP
);

userRoute.get(
  '/profile',
  isAuthenticated,
  getProfile
);

export default userRoute;