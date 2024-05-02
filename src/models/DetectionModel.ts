import mongoose from 'mongoose';

const DetectionsSchema = new mongoose.Schema(
    {
        videoId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('detections', DetectionsSchema);
