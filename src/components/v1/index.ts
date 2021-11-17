import { Router } from 'express';
import userRoute from './User/route';

const v1 = Router();

v1.use('/users', userRoute);

export default v1;