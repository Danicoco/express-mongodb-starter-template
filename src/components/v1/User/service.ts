/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { User, IUserModel } from '../../../database/models';
import { catchError } from '../../../config/common/utils';

export default class UserService {
    private _id: string  | undefined;

    private phoneNumber: string | undefined;

    private fullName: string | undefined;

    private email: string | undefined;

    private isVerified: boolean | undefined;

    private otp: string | undefined;

    private gender: string | undefined;

    constructor(phoneNumber = '', _id = '') {
        this._id = _id;
        this.phoneNumber = phoneNumber;
    }

    public async createUser(params: Partial<IUserModel>) {
        const user = await this.findUserByPhoneNumber({
            phoneNumber: params.phoneNumber,
        });
        if (user) throw catchError("You already have an account", 400);
        try {
            const newUser = new User({ ...params });
            await newUser.save();
            return this.getUser(newUser);
        } catch (error) {
            throw catchError("There was a problem creating your account", 500);
        }
    }

    public async updateGender(params: Partial<IUserModel>) {
        const user = await User
            .findOneAndUpdate(
                { _id: params.id },
                { gender: params.gender },
                { new: true }
            )
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError(
                    "There was a problem updating your gender",
                    500
                );
            });
        return user;
    }

    public async updateFullname(params: Partial<IUserModel>) {
        const user = await User
            .findOneAndUpdate(
                { _id: params.id },
                { fullName: params.fullName },
                { new: true }
            )
            .catch(
                // eslint-disable-next-line no-unused-vars
                (_e) => {
                    throw catchError(
                        "There was a problem updating your full name",
                        500
                    );
                });
      return user;
    }

    public async updatephoneNumber(params: Partial<IUserModel>) {
        const user = await User
            .findOneAndUpdate(
                { _id: params.id },
                { phoneNumber: params.phoneNumber },
                { new: true }
            )
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError(
                    "There was a problem creating your account",
                    500
                );
            });
      return user;
    }

    public async updateOTP(params: Partial<IUserModel>) {
        const user = await User
            .findOneAndUpdate(
                { phoneNumber: params.phoneNumber },
                { otp: params.otp },
                { new: true }
            )
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError(
                    "There was a problem creating your account",
                    500
                );
            });
        return user;
    }

    public async validateOTP(params: Partial<IUserModel>) {
        const user = await this.findUserByPhoneNumber({
            phoneNumber: params.phoneNumber,
        });
        
        if (!user) throw catchError("Invalid user", 400);
        
        const isMatch = bcrypt.compareSync(
                params.otp ? params.otp : '', user.otp ? user.otp : ''
            );
        if (isMatch) {
            await User.updateOne(
                { _id: user._id },
                { otp: '', isVerified: true },
                { new: true }
            );
            return true;
        }            

        throw new Error("OTP is invalid");
    }

    public async validateLogin(params: Partial<IUserModel>) {
        const user = await User
            .findOne()
            .where('phoneNumber')
            .equals(params.phoneNumber)
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError(
                    "Phone Number/Password is incorrect",
                    500
                );
            });
        if (user) {
            const isMatch = bcrypt
                .compareSync(
                    !params.password ? '' : params.password,
                    user.password
                );
            if (isMatch) return this.getUser(user);
            throw catchError("Phone Number/Password is incorrect", 400);
        }
        throw catchError("Phone Number/Password is incorrect", 400);
    }

    public async updatePassword(params: Partial<IUserModel>) {
        const user = await User
            .findOneAndUpdate(
                { _id: params.id },
                { password: params.password },
                { new: true }
            )
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError(
                    "There was a problem creating your account",
                    500
                );
            });
        return user ? this.getUser(user) : null;
    }

    public async getProfile(params: Partial<IUserModel>) {
        try {
            const user = await this.findUserByPhoneNumber(params);
            return user ? this.getUser(user) : null;
        } catch (error) {
            throw catchError("Can't get your profile", 500);
        }
    }

    public async getAllUser() {
        const users = await User
            .find()
            // eslint-disable-next-line no-unused-vars
            .catch((_e) => {
                throw catchError("Error getting users", 500);
            });
        return users;
    }

    public async findUserByPhoneNumber(params: Partial<IUserModel>) {
        const user = await User
            .findOne()
            .where('phoneNumber')
            .equals(params.phoneNumber)
            // eslint-disable-next-line no-unused-vars
            .catch((_err) => {
                throw catchError("Can't get your profile", 500);
                }
            );
        return user ? this.getUser(user) : null;
    }

    public getUser(u: Partial<IUserModel>) {
        if (u) {
            this._id = u._id;
            this.phoneNumber = u.phoneNumber;
            this.fullName = u.fullName;
            this.email = u.email;
            this.otp = u.otp;
            this.gender = u.gender;
            this.isVerified = u.isVerified;
        }

        return {
            _id: this._id,
            phoneNumber: this.phoneNumber,
            fullName: this.fullName,
            email: this.email,
            otp: this.otp,
            gender: this.gender,
            isVerified: this.isVerified,
        };
    }
}
