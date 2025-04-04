/**
 * @module ApiServer
 * @author Joshua Micheletti <joshua.e.n.micheletti@gmail.com>
 */

import { Router, Request, Response } from 'express';
import { getUsers } from './endpoints/getUsers';
import { postUser, postUserInputValidation } from './endpoints/postUser';
import rolesServer from './roles/rolesServer';
import { deleteUser, deleteUserInputValidation } from './endpoints/deleteUser';
import admin from '../../middleware/admin';
import { updateUser, updateUserInputValidation } from './endpoints/updateUser';
import dbadmin from '../../middleware/dbadmin';

/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
export default function apiServer(): Router {
    // create a new Express Router
    const router: Router = Router();

    router.get('/', dbadmin, getUsers);
    router.post('/', dbadmin, postUserInputValidation, postUser);
    router.delete('/', dbadmin, deleteUserInputValidation, deleteUser);
    router.post('/update', dbadmin, updateUserInputValidation, updateUser);

    router.use('/roles', rolesServer());

    /**
     * Endpoint for /healthcheck. Logs a message and returns OK
     *
     * @function
     * @param {Object} req request object from express
     * @param {Object} res response object from express
     * @returns {null}
     * @memberof Endpoints
     * @author Joshua Micheletti <j.micheletti@ebw.it>
     */
    function healthcheck(req: Request, res: Response) {
        console.log('Healthcheck /users');
        res.status(200).send('OK');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}
