import DayRecordModel from '../models/DayRecordModel';
import { MyEvent } from '../events/GlobalEvent';

async function insertCurrentDayRecord() {
    await DayRecordModel.create({
        detections: [],
    });
    MyEvent.emit('added_new_day_record_event');
}

async function deleteOldestDayRecord() {
    const oldestDayRecord = await DayRecordModel.findOne({}).sort({ createdAt: -1 });
    await DayRecordModel.deleteOne({ _id: oldestDayRecord?._id });
    MyEvent.emit('deleted_oldest_day_record_event');
}

export { insertCurrentDayRecord, deleteOldestDayRecord };
