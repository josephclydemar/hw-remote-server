import { Request, Response } from 'express';

// events
import { MyEvent } from '../events/GlobalEvent';

// models
import DayRecordModel from '../models/DayRecordModel';

async function getDayRecords(req: Request, res: Response): Promise<void> {
    try {
        const dayRecords = await DayRecordModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(dayRecords);
        return;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: GET /day_records');
        }
    }
}

async function getLatestDayRecord(req: Request, res: Response): Promise<void> {
    try {
        const currentDayRecord = await DayRecordModel.findOne({}).sort({ createdAt: 1 });
        res.status(200).json(currentDayRecord);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        }
    }
}

async function insertOneDayRecord(req: Request, res: Response): Promise<void> {
    try {
        const newDayRecord = await DayRecordModel.create({
            detections: req.body.detections,
        });
        res.status(201).json(newDayRecord);
        MyEvent.emit('added_new_day_record_event');
        return;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: POST /day_records');
        }
    }
}

export default { getDayRecords, getLatestDayRecord, insertOneDayRecord };
