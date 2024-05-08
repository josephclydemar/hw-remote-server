import mongoose from 'mongoose';

const DetectionsSchema = new mongoose.Schema(
    {
        videoId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('detections', DetectionsSchema);
