import mongoose from 'mongoose';

const AuthorizedUserEntrySchema = new mongoose.Schema(
    {
        capturedImage: { type: String, required: true },
        authorizedUserId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    },
    { timestamps: true },
);

export default mongoose.model('authorized_users_entries', AuthorizedUserEntrySchema);
