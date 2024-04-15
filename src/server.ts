import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Express, Response, Request, NextFunction } from 'express';
import { Server, Socket } from 'socket.io';

import { MyEvent } from './events/GlobalEvent';
import { logEvent } from './middlewares/logger';

// V1 API routes
import AuthorizedUsersV1Route from './routes/api-v1/AuthorizedUsersRoute';
import DetectionsV1Route from './routes/api-v1/DetectionsRoute';

dotenv.config();

const PORT: string = process.env.PORT || '8700';
const NODE_ENV: string = process.env.NODE_ENV || 'production';
const DATABASE_URI: string = process.env.DATABASE_URI || '';

const app: Express = express();

app.use(function (req: Request, res: Response, next: NextFunction) {
    logEvent(NODE_ENV, `${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', AuthorizedUsersV1Route);
app.use('/api/v1', DetectionsV1Route);

app.all('*', function (req: Request, res: Response): void {
    res.status(404).send('Invalid path.');
});

mongoose
    .connect(DATABASE_URI)
    .then(function (): void {
        if (NODE_ENV === 'development') {
            const httpServer = app.listen(PORT, function (): void {
                logEvent(NODE_ENV, `Listening on PORT: ${PORT}`);
            });

            const io: Server = new Server(httpServer, { cors: { origin: '*' } });

            MyEvent.on('added_new_authorized_user_event', function (): void {
                io.emit('added_new_authorized_user');
            });
            MyEvent.on('added_new_detection_event', function (): void {
                io.emit('added_new_current_day_detection');
            });

            io.on('connection', function (socket: Socket) {
                logEvent(NODE_ENV, `Socket client [${socket.id}] connected.`);
                socket.on('message', function (data: string): void {
                    logEvent(NODE_ENV, `Socket client [${socket.id}] message: ${data}`);
                });

                socket.on('disconnect', function () {
                    logEvent(NODE_ENV, `Socket client [${socket.id}] disconnected.`);
                });
            });
        }
    })
    .catch(function (err: Error): void {
        console.log(err.message);
    });
