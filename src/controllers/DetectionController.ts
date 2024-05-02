import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { Request, Response } from 'express';

// events
import { MyEvent } from '../events/GlobalEvent';

// models
import DetectionModel from '../models/DetectionModel';


// * GET controllers
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

async function streamOneDetectionVideo(req: Request, res: Response): Promise<void> {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (range === undefined) {
        res.status(400).send('Request Range header missing');
        return;
    }
    // console.log(range);
    const videoPath = path.join(__dirname, '..', '..', 'videos', `${req.params.id}.mp4`);
    // console.log(videoPath);

    // Check if the video file exists
    if (!fs.existsSync(videoPath)) {
        res.status(404).send('Video file not found');
        return;
    }


    // Obtain video file stats
    const videoSize = fs.statSync(videoPath).size;

    // Parse range headers
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const START: number = Number(range.replace(/\D/g, ''));
    const END = Math.min(START + CHUNK_SIZE, videoSize - 1);

    // Calculate content length and set response headers
    const contentLength = END - START + 1;

    // Send partial content response (206 Partial Content)
    res.writeHead(206, {
        'Content-Range': `bytes ${START}-${END}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    });

    // Create read stream for video file and pipe it to response
    const videoStream = fs.createReadStream(videoPath, { start: START, end: END });
    videoStream.pipe(res);
}


// * POST controllers
async function insertOneDetection(req: Request, res: Response): Promise<void> {
    try {
        let requestFile = req.file;
        if(requestFile !== undefined && requestFile !== null && 'id' in requestFile) {
            const newDetection = await DetectionModel.create({
                videoId: requestFile.id,
            });
            res.status(201).json(newDetection);
            MyEvent.emit('added_new_detection_event');
            return;
        }
        res.status(202).json({ message: 'File was not saved to database' });
        MyEvent.emit('added_new_detection_event');
        return;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: POST /detections');
        }
    }
}

export default {
    getDetections, 
    streamOneDetectionVideo,
    insertOneDetection
};
