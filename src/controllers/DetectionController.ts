import { Request, Response } from 'express';

// events
import { MyEvent } from '../events/GlobalEvent';

// models
import DetectionModel from '../models/DetectionModel';

async function getDetections(req: Request, res: Response): Promise<void> {
    try {
        const detections = await DetectionModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(detections);
        return;
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
        const conflict = await DetectionModel.findOne({ recordedVideo: req.body.recordedVideo }).exec();
        if (conflict === null || conflict === undefined) {
            // No conflict
            const newDetection = await DetectionModel.create({
                recordedVideo: req.body.recordedVideo,
            });
            res.status(200).json(newDetection);
            MyEvent.emit('added_new_detection_event');
            return;
        } else {
            res.status(409).json({ message: 'Detections conflict of recordedVideos', conflict: true });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: POST /detections');
        }
    }
}

export default { getDetections, insertOneDetection };
