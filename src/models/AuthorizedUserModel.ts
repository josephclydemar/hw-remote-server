import mongoose from 'mongoose';

const AuthorizedUserSchema = new mongoose.Schema(
    {
        profileImage: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true },
);

export default mongoose.model('authorized_users', AuthorizedUserSchema);
