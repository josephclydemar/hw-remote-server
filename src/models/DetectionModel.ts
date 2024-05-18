import mongoose from 'mongoose';

const DetectionsSchema = new mongoose.Schema(
    {
        videoId: {
            type: String,
            required: true,
        },
        videoFormat: {
            type: String,
            required: true,
        },
        videoDurationSeconds: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('detections', DetectionsSchema);
