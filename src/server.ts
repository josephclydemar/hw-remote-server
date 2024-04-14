import cors from 'cors';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Express, Response, Request, NextFunction } from 'express';
// import { Server } from 'socket.io';

import { logEvent } from './middlewares/logger';

dotenv.config();

const PORT: string = process.env.PORT || '8700';
const NODE_ENV: string = process.env.NODE_ENV || 'production';
const DATABASE_URI: string = process.env.DATABASE_URI || '';

const app: Express = express();

// V1 API routes
import AuthorizedUsersV1Route from './routes/api-v1/AuthorizedUsersRoute';

app.use(function (req: Request, res: Response, next: NextFunction) {
    logEvent(NODE_ENV, `${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', AuthorizedUsersV1Route);

mongoose
    .connect(DATABASE_URI)
    .then(function (): void {
        app.listen(PORT, function (): void {
            logEvent(NODE_ENV, `Listening on PORT: ${PORT}`);
        });
    })
    .catch(function (err: Error): void {
        console.log(err.message);
    });
