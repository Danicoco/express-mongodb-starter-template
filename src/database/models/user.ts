import * as connections from '../connection';
import { Document, Schema } from 'mongoose';

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
*/
export interface IUserModel extends Document {
    fullName: string;
    phoneNumber: string;
    email: string;
    isVerified: boolean;
    password: string;
    otp: string;
    username: string;
    gender: string;
}

const UserSchema: Schema = new Schema({
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true
    },
    username: String,
    otp: String,
    gender: {
        type: String,
        enum: ['female', 'male'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        min: [14, 'Enter a valid phone number'],
        max: [14, 'Enter a valid phone number'],
        required: true,
        unique: true,
        trim: true
    },
    password: String,
}, {
    collection: 'users',
    versionKey: false
});

UserSchema.set('timestamps', true);

export default connections.db.model < IUserModel > ('Users', UserSchema);
