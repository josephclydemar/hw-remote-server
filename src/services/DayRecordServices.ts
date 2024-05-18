import DayRecordModel from '../models/DayRecordModel';
import { MyEvent } from '../events/GlobalEvent';

async function insertCurrentDayRecordService() {
    await DayRecordModel.create({
        detections: [],
    });
    MyEvent.emit('added_new_day_record_event');
}

async function deleteOldestDayRecordService() {
    const oldestDayRecord = await DayRecordModel.find({}).sort({ createdAt: 1 });
    if (oldestDayRecord.length > 50) {
        await DayRecordModel.deleteOne({ _id: oldestDayRecord[0]?._id });
        MyEvent.emit('deleted_oldest_day_record_event');
    }
}

export { insertCurrentDayRecordService, deleteOldestDayRecordService };
