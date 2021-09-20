import 'module-alias/register';
import * as dotenv from 'dotenv';
import logger from '@app/utils/logger';
import http from 'http';
import express from 'express';
import { router } from '@app/routes/routes';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

export const app = express();
app.use(helmet());
app.use(cors());

// Express configuration
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: false }));

app.set('port', PORT || 3001);
app.disable('x-powered-by');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
    next();
});

app.use('/', router);
const server = http.createServer(app);

server.listen(app.get('port'), () => {
  logger.info(`API listening on port ${app.get('port')}`);
});

server.on('error', (error: Error) => {
  logger.error(error);
});

server.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: ${p} reason: ${reason}`);
});
