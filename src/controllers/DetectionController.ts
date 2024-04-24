import { v4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// events
import { MyEvent } from '../events/GlobalEvent';

// middlewares
// import { uploadFiles } from '../middlewares/Uploader';

// models
import DetectionModel from '../models/DetectionModel';

async function getDetections(req: Request, res: Response): Promise<void> {
    try {
        const detections = await DetectionModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(detections);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: GET /detections');
        }
    }
}

async function insertOneDetection(req: Request, res: Response): Promise<void> {
    try {
        // uploadFiles(req, res, next);
        const newDetection = await DetectionModel.create({
            recordedVideo: v4(),
        });
        res.status(200).json(newDetection);
        MyEvent.emit('added_new_detection_event');
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: POST /detections');
        }
    }
    // next();
}

export default { getDetections, insertOneDetection };
