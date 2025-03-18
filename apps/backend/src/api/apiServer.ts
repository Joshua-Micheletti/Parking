/**
 * @module ApiServer
 * @author Joshua Micheletti <joshua.e.n.micheletti@gmail.com>
 */

import { Router, Request, Response } from 'express';
import usersServer from './users/usersServer';
import distancesServer from './distances/distancesServer';
import parkingServer from './parking/parkingServer';
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
  router.use('/distances', authenticate, distancesServer());
  router.use('/parking', authenticate, parkingServer());

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
