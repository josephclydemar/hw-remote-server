import path from 'path';
import fs from 'fs';
import cors from 'cors';

import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import mongoose from 'mongoose';
import express, { Express, Response, Request } from 'express';
import { Server } from 'socket.io';

dotenv.config();

const PORT: string = process.env.PORT || '8700';
const NODE_ENV: string = process.env.NODE_ENV || 'production';
const DATABASE_URI: string = process.env.DATABASE_URI || '';

const APP: Express = express();

mongoose
    .connect(DATABASE_URI)
    .then(function (): void {
        APP.listen(PORT, function (): void {});
    })
    .catch(function (err: Error): void {
        console.log(err.message);
    });
