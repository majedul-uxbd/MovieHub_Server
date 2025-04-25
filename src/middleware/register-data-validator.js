/**
 * @author Md. Majedul Islam,
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */
const _ = require('lodash');
const { API_STATUS_CODE } = require('../consts/error-status');
const { setServerResponse } = require('../utilities/server-response');
const { isValidUserName, isValidEmail, isValidPassword } = require('../utilities/user-data-validator');


/**
 * @description This function will validate user register data
 */
const registerUserValidation = async (req, res, next) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    if (!isValidUserName(userData.name)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_user_name',
            )
        );
    }

    if (!isValidEmail(userData.email)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email',
            )
        );
    }

    if (!isValidPassword(userData.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_password',
            )
        );
    }

    req.body.userData = userData;
    next();
}

module.exports = {
    registerUserValidation
}