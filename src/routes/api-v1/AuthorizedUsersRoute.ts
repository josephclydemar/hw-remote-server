import express, { Router } from 'express';

import AuthorizedUsersController from '../../controllers/AuthorizedUserController';

const router: Router = express.Router();

router.route('/authorized_users').get(AuthorizedUsersController.getAuthorizedUsers).post(AuthorizedUsersController.insertOneAuthorizedUser);

export default router;
