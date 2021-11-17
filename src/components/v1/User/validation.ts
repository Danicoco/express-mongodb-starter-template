import { body } from 'express-validator';
import { isValidPhone } from '../../../config/common/isPhoneValid';
import { catchError } from '../../../config/common/utils';

export const userCredential = [
    body('phoneNumber')
        .isString()
        .notEmpty()
        .isLength({ min: 11, max: 11 })
        .customSanitizer((value) => {
            const valid = isValidPhone(value);
        if (!valid.result) throw catchError('Enter a valid phone number', 400);
            const the_value = `
            +234${valid.phoneNumber.substring(1, valid.phoneNumber.length + 1)}
            `;
            return the_value;
        })
        .withMessage("Enter a valid phone number"),
    body('password')
        .isString()
        .notEmpty()
        .withMessage("Enter password"),
];

export const isGender = [
    body('gender')
        .notEmpty()
        .isString()
        .withMessage('Enter your gender'),
];

export const isFullName = [
    body('fullName')
        .isString()
        .notEmpty()
        .withMessage('Enter full name'),
];

export const isPassword = [
    body('password')
        .isString()
        .notEmpty()
        .isLength({ min: 14, max: 14 }),
];