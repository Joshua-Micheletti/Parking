"use strict";
/**
 * @module ApiServer
 * @author Joshua Micheletti <j.micheletti@ebw.it>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rolesServer;
const express_1 = require("express");
const getRole_1 = require("./endpoints/getRole");
const setRole_1 = require("./endpoints/setRole");
/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
function rolesServer() {
    // create a new Express Router
    const router = (0, express_1.Router)();
    router.get('/', getRole_1.getRole);
    router.post('/', setRole_1.setRoleInputValidation, setRole_1.setRole);
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
        console.log('Healthcheck /users/roles');
        res.status(200).send('OK');
    }
    router.use('/healthcheck', healthcheck);
    return router;
}
