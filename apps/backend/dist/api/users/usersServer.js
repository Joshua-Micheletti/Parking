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
const getUsers_1 = require("./endpoints/getUsers");
const postUser_1 = require("./endpoints/postUser");
const rolesServer_1 = __importDefault(require("./roles/rolesServer"));
/**
 * Function to setup the various endpoints of the API
 *
 * @param {Router} router Express base router object
 * @returns {Router} Same router object but with the endpoints defined
 */
function apiServer() {
    // create a new Express Router
    const router = (0, express_1.Router)();
    router.get("/", getUsers_1.getUsers);
    router.post("/", postUser_1.postUserInputValidation, postUser_1.postUser);
    router.use("/roles", (0, rolesServer_1.default)());
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
        console.log("Healthcheck /users");
        res.status(200).send("OK");
    }
    router.use("/healthcheck", healthcheck);
    return router;
}
