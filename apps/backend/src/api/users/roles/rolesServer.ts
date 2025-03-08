/**
 * @module ApiServer
 * @author Joshua Micheletti <j.micheletti@ebw.it>
 */

import { Router, Request, Response } from 'express';
import { getRole } from './endpoints/getRole';
import { setRole, setRoleInputValidation } from './endpoints/setRole';

/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
export default function rolesServer(): Router {
    // create a new Express Router
    const router: Router = Router();

    router.get('/', getRole);
    router.post('/', setRoleInputValidation, setRole);

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
        console.log('Healthcheck /users/roles');
        res.status(200).send('OK');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}
