import { Router, Request, Response } from 'express';
import v1Router from './v1';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json("Welcome to Fantasy Predict API");
});
router.use('/api/v1', v1Router);

export default router;