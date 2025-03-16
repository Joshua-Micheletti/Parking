/**
 * @module ApiServer
 * @author Joshua Micheletti <joshua.e.n.micheletti@gmail.com>
 */

import { Router, Request, Response } from 'express';
import { getDistances } from './endpoints/getDistances';
import { postDistance, postDistanceInputValidation } from './endpoints/postDistance';
// import { deleteUser, deleteUserInputValidation } from './endpoints/deleteDistance';
// import { updateUser, updateUserInputValidation } from './endpoints/updateDistance';
import admin from '../../middleware/admin';

/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
export default function apiServer(): Router {
    // create a new Express Router
    const router: Router = Router();

    router.get('/', admin, getDistances);
    router.post('/', admin, postDistanceInputValidation, postDistance);
    // router.delete('/', admin, deleteUserInputValidation, deleteUser);
    // router.post('/update', admin, updateUserInputValidation, updateUser);

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
