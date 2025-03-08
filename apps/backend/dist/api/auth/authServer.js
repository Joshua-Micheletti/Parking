"use strict";
/**
 * @module ApiServer
 * @author Joshua Micheletti <j.micheletti@ebw.it>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiServer;
const express_1 = require("express");
const login_1 = require("./endpoints/login");
/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
function apiServer() {
    // create a new Express Router
    const router = (0, express_1.Router)();
    router.post('/login', login_1.loginInputValidation, login_1.login);
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
    function healthcheck(req, res) {
        console.log('Healthcheck /auth');
        res.status(200).send('OK');
    }
    router.use('/healthcheck', healthcheck);
    return router;
}
