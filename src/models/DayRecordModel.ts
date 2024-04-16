import mongoose from 'mongoose';

const DayRecordsSchema = new mongoose.Schema(
    {
        detections: {
            type: [mongoose.SchemaTypes.ObjectId],
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('day_records', DayRecordsSchema);
