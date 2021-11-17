import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { catchError } from '../common/utils';
import { User } from '../../database/models';
import { AuthenticatedUser, Users } from '../../types';

/**
 * 
 * @param {RequestWithUser} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 */
export async function isAuthenticated(
    req: AuthenticatedUser,
    _res: Response,
    next: NextFunction) {
    const token = req.headers['x-access-token'] as string;
    try {
        if (!token)
            throw catchError("Your session has expired. Please login again");
        const decoded = jwt
            .verify(
                token,
                process.env.SECRET || ""
            ) as unknown as Users;
        
        const user = await User.findOne()
            .where('_id').equals(decoded._id);
        req.user = {
            id: user?._id,
            phoneNumber: user?.phoneNumber,
            username: user?.username,
        };
        
        return next();
    } catch (error) {
        next(error);
    }
}
