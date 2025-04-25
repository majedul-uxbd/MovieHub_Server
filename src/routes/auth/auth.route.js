/**
 * @author Md Majedul Islam 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const express = require("express");
const { loginUserValidation } = require("../../middleware/login-validator");
const { userLogin } = require("../../main/user-login");
const { registerUserValidation } = require("../../middleware/register-data-validator");
const { registerUser } = require("../../main/register-user");
const { setServerResponse } = require("../../utilities/server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { refreshToken } = require("../../middleware/authenticate-token");

const authRoute = express.Router();


/**
 * @description This API is used to register a new user
 */
authRoute.post("/register",
    registerUserValidation,
    async (req, res) => {
        registerUser(req.body.userData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });

/**
 * @description This API is used to user login
 */
authRoute.post("/login",
    loginUserValidation,
    async (req, res) => {
        userLogin(req.body.userData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    token: data.data.token,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });

/**
 * @description This API is used to get refresh token
 */
authRoute.post('/refresh-token', (req, res) => {
    const oldToken = (req.headers['authorization'] || req.body.token) + '';

    // const oldToken = req.header.token;
    const newToken = refreshToken(oldToken);
    console.warn('🚀 ~ authRoute.post ~ newToken:', newToken);
    if (!newToken) {
        return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
            setServerResponse(
                API_STATUS_CODE.UNAUTHORIZED,
                'invalid_token'
            )
        );
    };
    res.json({ token: newToken });
});

/**
 * @description This API is used to user login
 */
authRoute.post("/user-data",
    async (req, res) => {
        userData(req.body.userData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    token: data.data.token,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });


module.exports = {
    authRoute
}