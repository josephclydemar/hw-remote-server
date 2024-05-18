import { Request, Response } from 'express';

// events
import { MyEvent, Events } from '../events/GlobalEvent';

// models
import AuthorizedUserEntryModel from '../models/AuthorizedUserEntryModel';

async function getAllAuthorizedUsersEntries(req: Request, res: Response): Promise<void> {
    try {
        const authorizedUserEntries = await AuthorizedUserEntryModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(authorizedUserEntries);
        return;
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, error: true });
        } else {
            throw new Error('Error: GET /authorized_users');
        }
    }
}

async function getOneAuthorizedUserEntries(req: Request, res: Response): Promise<void> {
    try {
        const authorizedUserEntries = await AuthorizedUserEntryModel.find({ authorizedUserId: req.params.authorized_user_id }).sort({ createdAt: -1 });
        res.status(200).json(authorizedUserEntries);
        return;
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, error: true });
        } else {
            throw new Error('Error: GET /authorized_users');
        }
    }
}

async function insertOneAuthorizedUserEntry(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    try {
        const newAuthorizedUserEntry = await AuthorizedUserEntryModel.create({
            capturedImage: req.body.capturedImage,
            authorizedUserId: req.body.authorizedUserId,
        });
        res.status(201).json(newAuthorizedUserEntry);
        MyEvent.emit(Events.addedNewAuthorizedUserEntryEvent);
        return;
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, error: true });
        } else {
            throw new Error('Error: POST /authorized_users');
        }
    }
}

export default { getAllAuthorizedUsersEntries, getOneAuthorizedUserEntries, insertOneAuthorizedUserEntry };
