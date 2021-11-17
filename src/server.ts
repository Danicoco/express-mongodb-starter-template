import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import './database/connection';
import { errorHandler } from './config/error';
import compression from 'compression';
import router from './components';
const app: Express = express();

app.use(helmet());
app.use(cors({
  origin: (_origin, callback) => {
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.disable('x-powered-by');
app.use(compression());
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT || 3000);
export default app;
