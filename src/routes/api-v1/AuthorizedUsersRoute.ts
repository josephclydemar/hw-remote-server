import express, { Router } from 'express';

import AuthorizedUsersController from '../../controllers/AuthorizedUserController';

const AuthorizedUsersV1Router: Router = express.Router();

AuthorizedUsersV1Router.route('/authorized_users').get(AuthorizedUsersController.getAuthorizedUsers).post(AuthorizedUsersController.insertOneAuthorizedUser);
AuthorizedUsersV1Router.route('/authorized_users/:id').get(AuthorizedUsersController.getOneAuthorizedUser);

export default AuthorizedUsersV1Router;
