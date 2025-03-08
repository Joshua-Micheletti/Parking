"use strict";
/**
 * @module ApiServer
 * @author Joshua Micheletti <j.micheletti@ebw.it>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiServer;
const express_1 = require("express");
const usersServer_1 = __importDefault(require("./users/usersServer"));
const authServer_1 = __importDefault(require("./auth/authServer"));
const auth_1 = __importDefault(require("../middleware/auth"));
/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
function apiServer() {
    // create a new Express Router
    const router = (0, express_1.Router)();
    router.use('/users', auth_1.default, (0, usersServer_1.default)());
    router.use('/auth', (0, authServer_1.default)());
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
        console.log('Healthcheck /');
        res.status(200).send('OK');
    }
    router.use('/healthcheck', healthcheck);
    return router;
}
