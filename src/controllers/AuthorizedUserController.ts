import { Request, Response } from 'express';

import AuthorizedUserModel from '../models/AuthorizedUserModel';

async function getAuthorizedUsers(req: Request, res: Response): Promise<void> {
    try {
        const authorizedUsers = await AuthorizedUserModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(authorizedUsers);
        return;
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: GET /authorized_users');
        }
    }
}

async function insertOneAuthorizedUser(req: Request, res: Response): Promise<void> {
    try {
        const conflict = await AuthorizedUserModel.findOne({ name: req.body.name }).exec();
        if (conflict === null || conflict === undefined) {
            // No conflict
            const newAuthorizedUser = await AuthorizedUserModel.create({
                name: req.body.name,
            });
            res.status(200).json(newAuthorizedUser);
            return;
        } else {
            res.status(409).json({ message: 'Authorized Users conflict of Names', conflict: true });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server Error!!', error: true });
        } else {
            throw new Error('Error: POST /authorized_users');
        }
    }
}

export default { getAuthorizedUsers, insertOneAuthorizedUser };
