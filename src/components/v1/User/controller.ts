import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { success, AuthenticateRequest } from '../../../config/common/utils';
import { AuthenticatedUser } from '../../../types';
import UserService from './service';
import bcrypt from 'bcrypt';
import { sendMessage } from '../../../config/common/sms';

// create account
export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, password } = req.body;
  try {
    const otp = crypto.randomInt(12345).toString();
    console.log({ phoneNumber, otp });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const hashOtp = bcrypt.hashSync(otp, salt);
    const user = await new UserService(phoneNumber)
      .createUser({
        phoneNumber,
        password: hash,
        otp: hashOtp
      });
    //send message to phone number
    await sendMessage({
      to: [user.phoneNumber ? user.phoneNumber : ''],
      message: `Your verification code is ${otp}`,
      from: 'F-Predict',
      enqueue: true,
    });
    return res.status(200).json(success('Account successfully created', user));
  } catch (error) {
    return next(error);
  }
};

// signin user
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await new UserService(phoneNumber)
      .validateLogin({
        phoneNumber,
        password,
      });
    const token = AuthenticateRequest(user);
    return res.status(200).json(
      success('Login successful', { token, user })
    );
  } catch (error) {
    next(error);
  }
};

// resend otp && request forgot password
export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber } = req.body;
  const otp = crypto.randomInt(12345).toString();
  try {
    const user = await new UserService(phoneNumber)
      .updateOTP({
        phoneNumber,
        otp,
      });
    //send otp to sms
    await sendMessage({
      to: [phoneNumber],
      message: `Your verification code is ${otp}`,
      from: 'F-Predict',
      enqueue: true,
    });
    return res.status(200).json(
      success('OTP successfully sent', user ? user : { user })
    );
  } catch (error) {
    return next(error);
  }
};

// verify otp
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await new UserService(phoneNumber)
      .validateOTP({
        phoneNumber,
        otp,
      });
    return res.status(200).json(
      success('OTP validated', { user })
    );
  } catch (error) {
    return next(error);
  }
};
// update gender
export const updateGender = async (
  req: AuthenticatedUser,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { gender },
    user: { id },
  } = req;
  try {
    const user = await new UserService(id)
      .updateGender({ gender: gender, id: id });
    return res.status(200).json(
      success('Gender updated successfully', user ? user : { user })
    );
  } catch (error) {
    return next(error);
  }
};

// update phone number
export const updatePhoneNumber = async (
  req: AuthenticatedUser,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { phoneNumber },
    user: { id },
  } = req;
  try {
    const user = await new UserService(id)
      .updatephoneNumber({
        phoneNumber,
        id,
      });
    return res.status(200).json(
      success('Phone number updated successfully', user ? user : {})
    );
  } catch (error) {
    return next(error);
  }
};

// update full name
export const updateFullname = async (
  req: AuthenticatedUser,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { fullName },
    user: { id },
  } = req;
  try {
    const user = await new UserService(id)
      .updateFullname({
        fullName,
        id,
      });
    return res.status(200).json(
      success('Full name updated successfully', user ? user : {})
    );
  } catch (error) {
    return next(error);
  }
};

// update password
export const updatePassword = async (
  req: AuthenticatedUser,
  res: Response, next: NextFunction
) => {
  const {
    body: { password },
    user: { id },
  } = req;
  try {
    const user = await new UserService(id)
      .updatePassword({
        password,
        id,
      });
    return res.status(200).json(
      success('You can now use your new password to login', user ? user : {})
    );
  } catch (error) {
    return next(error);
  }
};

// get user detail
export const getProfile = async (
  req: AuthenticatedUser,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber } = req.user;
  try {
    const user = await new UserService(phoneNumber)
      .getProfile({
        phoneNumber,
      });
    return res.status(200).json(
      success('Profile information retrieved', user ? user : {})
    );
  } catch (error) {
    return next(error);
  }
};

// get all user
export const getAllUser = async (
  _req: AuthenticatedUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await new UserService('').getAllUser();
    return res.status(200).json(
      success('Profile information retrieved', user)
    );
  } catch (error) {
    return next(error);
  }
};
