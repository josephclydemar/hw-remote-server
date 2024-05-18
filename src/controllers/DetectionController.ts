import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

// events
import { MyEvent } from '../events/GlobalEvent';

// models
import DetectionModel from '../models/DetectionModel';
import DayRecordModel from '../models/DayRecordModel';

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

async function getSpecificDetections(req: Request, res: Response): Promise<void> {
    try {
        // console.log(req);
        const requestBody = req.body;
        if ('detection_ids' in requestBody) {
            const detections = await DetectionModel.find({ _id: { $in: requestBody.detection_ids } }).sort({ createdAt: -1 });
            res.status(200).json(detections);
        }
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

    const detection = await DetectionModel.findOne({ _id: req.params.id });
    if (detection === undefined || detection === null) {
        res.json(400).send('Resource does not exist');
        return;
    }
    const { videoId, videoFormat } = detection;
    // console.log(range);
    const videoPath = path.join(__dirname, '..', '..', 'videos', `${videoId}.${videoFormat}`);
    // console.log(videoPath);

    // Check if the video file exists
    if (!fs.existsSync(videoPath)) {
        res.status(404).send('Video file not found');
        return;
    }

    // Obtain video file stats
    const videoSize = fs.statSync(videoPath).size;

    // Parse range headers
    const CHUNK_SIZE = 50 ** 6; // 5MB
    const START: number = Number(range.replace(/\D/g, ''));
    const END = Math.min(START + CHUNK_SIZE, videoSize - 1);

    // Calculate content length and set response headers
    const contentLength = END - START + 1;

    // Send partial content response (206 Partial Content)
    res.writeHead(206, {
        'Content-Range': `bytes ${START}-${END}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': `video/${videoFormat}`,
    });

    // Create read stream for video file and pipe it to response
    const videoStream = fs.createReadStream(videoPath, { start: START, end: END });
    videoStream.pipe(res);
}

// * POST controllers
async function insertOneDetection(req: Request, res: Response): Promise<void> {
    try {
        const requestFile = req.file;
        const requestBody = req.body;
        console.log({ requestFile, requestBody });
        if (requestFile !== undefined && requestFile !== null) {
            if ('id' in requestFile && 'day_record_id' in requestBody) {
                const newDetection = await DetectionModel.create({
                    videoId: requestFile.id,
                    videoFormat: path.extname(requestFile.filename).substring(1),
                });
                await DayRecordModel.updateOne(
                    {
                        _id: requestBody.day_record_id,
                    },
                    {
                        $addToSet: {
                            detections: newDetection._id,
                        },
                    },
                );
                res.status(201).json(newDetection);
                MyEvent.emit('added_new_detection_event');
                MyEvent.emit('added_new_day_record_event');
                return;
            } else if ('filename' in requestFile && 'video_duration_seconds' in requestBody && 'day_record_id' in requestBody) {
                const format: string = path.extname(requestFile.filename);
                const newDetection = await DetectionModel.create({
                    videoId: path.basename(requestFile.filename, format),
                    videoFormat: format.substring(1),
                    videoDurationSeconds: requestBody.video_duration_seconds,
                });
                await DayRecordModel.updateOne(
                    {
                        _id: requestBody.day_record_id,
                    },
                    {
                        $addToSet: {
                            detections: newDetection._id,
                        },
                    },
                );
                res.status(201).json(newDetection);
                MyEvent.emit('added_new_detection_event');
                MyEvent.emit('added_new_day_record_event');
                return;
            }
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
    getSpecificDetections,
    streamOneDetectionVideo,
    insertOneDetection,
};
