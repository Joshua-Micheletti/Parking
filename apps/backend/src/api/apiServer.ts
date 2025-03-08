/**
 * @module ApiServer
 * @author Joshua Micheletti <j.micheletti@ebw.it>
 */

import { Router, Request, Response } from 'express';
import usersServer from './users/usersServer';
import authServer from './auth/authServer';
import authenticate from '../middleware/auth';

/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
export default function apiServer(): Router {
  // create a new Express Router
  const router: Router = Router();

  router.use('/users', authenticate, usersServer());
  router.use('/auth', authServer());

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
    console.log('Healthcheck /');
    res.status(200).send('OK');
  }

  router.use('/healthcheck', healthcheck);

  return router;
}
