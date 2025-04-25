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

const authRoute = express.Router();

/**
 * @description This is used to user login
 */
authRoute.post("/login",
    loginUserValidation,
    async (req, res) => {
        userLogin(req.body.user)
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