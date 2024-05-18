import express, { Router } from 'express';

import AuthorizedUsersEntryController from '../../controllers/AuthorizedUserEntryController';

const AuthorizedUsersV1Router: Router = express.Router();

AuthorizedUsersV1Router.route('/authorized_users_entries')
    .get(AuthorizedUsersEntryController.getAllAuthorizedUsersEntries)
    .post(AuthorizedUsersEntryController.insertOneAuthorizedUserEntry);

AuthorizedUsersV1Router.route('/authorized_users_entries/:authorized_user_id').get(AuthorizedUsersEntryController.getOneAuthorizedUserEntries);

export default AuthorizedUsersV1Router;
