import express, { Router } from 'express';

import AuthorizedUsersController from '../../controllers/AuthorizedUserController';

const router: Router = express.Router();

router.route('/authorized_users').get(AuthorizedUsersController.getAuthorizedUsers).post(AuthorizedUsersController.insertOneAuthorizedUser);
router.route('/authorized_users/:id').get(AuthorizedUsersController.getOneAuthorizedUser);

export default router;
