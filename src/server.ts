import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Express, Response, Request, NextFunction } from 'express';
import { Server, Socket } from 'socket.io';

import { MyEvent, Events } from './events/GlobalEvent';
import { logEvent } from './middlewares/Logger';

// V1 API routes
import AuthorizedUsersV1Router from './routes/api-v1/AuthorizedUsersRoute';
import AuthorizedUsersEntriesV1Router from './routes/api-v1/AuthorizedUsersEntriesRoute';
import DayRecordsV1Router from './routes/api-v1/DayRecordsRoute';
import DetectionsV1Router from './routes/api-v1/DetectionsRoute';

import DayRecordsV2Router from './routes/api-v2/DayRecordsRoute';
import DetectionsV2Router from './routes/api-v2/DetectionsRoute';

// Cron Jobs
import { insertCurrentDayRecordService, deleteOldestDayRecordService } from './services/DayRecordServices';

dotenv.config();

const PORT: string = process.env.PORT || '8700';
const NODE_ENV: string = process.env.NODE_ENV || 'uninitialized';
const DATABASE_URI: string = process.env.LOCAL_DATABASE_URI || '';

const app: Express = express();

app.use(function (req: Request, res: Response, next: NextFunction) {
    logEvent(NODE_ENV, `${req.headers.host}    ${req.method}\t${req.url}`);
    next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', AuthorizedUsersV1Router);
app.use('/api/v1', AuthorizedUsersEntriesV1Router);
app.use('/api/v1', DayRecordsV1Router);
app.use('/api/v1', DetectionsV1Router);

app.use('/api/v2', DayRecordsV2Router);
app.use('/api/v2', DetectionsV2Router);

app.all('*', function (req: Request, res: Response): void {
    res.status(404).send('Invalid path.');
});

mongoose
    .connect(DATABASE_URI)
    .then(function (): void {
        logEvent(NODE_ENV, `${DATABASE_URI.split('+')[0]} Connected to database`);
        if (NODE_ENV === 'development') {
            const httpServer = app.listen(PORT, function (): void {
                logEvent(NODE_ENV, `Listening on PORT: ${PORT}`);
            });

            const io: Server = new Server(httpServer, { cors: { origin: '*' } });

            // Services
            cron.schedule('0 0 0 * * *', function (): void {
                // Execute everyday
                insertCurrentDayRecordService();
                deleteOldestDayRecordService();
            });

            // cron.schedule('0 * * * * *', function (): void {
            //     // Execute minute
            //     logEvent(NODE_ENV, 'Created new day_record.');
            //     insertCurrentDayRecordService();
            //     deleteOldestDayRecordService();
            // });

            // cron.schedule('* * * * * *', function (): void {
            //     // Execute second
            //     logEvent(NODE_ENV, 'Created new day_record.')
            //     insertCurrentDayRecordService();
            //     deleteOldestDayRecordService();
            // });

            MyEvent.on(Events.addedNewAuthorizedUserEvent, function (): void {
                io.emit(Events.updateAuthorizedUserEvent);
            });

            MyEvent.on(Events.addedNewAuthorizedUserEntryEvent, function (): void {
                io.emit(Events.updateAuthorizedUserEntryEvent);
            });

            MyEvent.on(Events.addedNewDayRecordEvent, function (): void {
                io.emit(Events.updateDayRecord);
            });

            MyEvent.on(Events.addedNewDetectionEvent, function (): void {
                io.emit(Events.updateCurrentDayDetection);
            });

            io.on('connection', function (socket: Socket) {
                logEvent(NODE_ENV, `Socket client [${socket.id}] connected.`);

                socket.on('message', function (data: string): void {
                    logEvent(NODE_ENV, `Socket client [${socket.id}] message: ${data}`);
                });

                socket.on('from_raspi_notif', function (data: any): void {
                    socket.broadcast.emit('from_server_notif', data);
                });

                socket.on('from_raspi_doorbell_press', function (data: string): void {
                    socket.broadcast.emit('from_server_doorbell_press', data);
                });

                socket.on('from_raspi_user_entered', function (data: string): void {
                    socket.broadcast.emit('from_server_user_entered', data);
                });

                socket.on('from_raspi_number_of_faces_detected', function (data: number): void {
                    socket.broadcast.emit('from_server_number_of_faces_detected', data);
                });

                // socket.on('from_mobile_to_add_new_authorized_user', function (data: { name: string }): void {
                //     socket.broadcast.emit('from_server_to_add_new_authorized_user', data);
                // });

                socket.on('from_mobile_control_door', function (data: [string, string]): void {
                    socket.broadcast.emit('from_server_control_door', data);
                });

                socket.on('from_mobile_control_light', function (data: [string, string]): void {
                    socket.broadcast.emit('from_server_control_light', data);
                });

                socket.on('from_mobile_set_operating_mode', function (data: [string, string]): void {
                    socket.broadcast.emit('from_server_set_operating_mode', data);
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
