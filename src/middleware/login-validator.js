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
const { isValidEmail, isValidPassword } = require('../utilities/user-data-validator');


/**
 * @description This function will validate user login data
 */
const loginUserValidation = async (req, res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    if (_.isEmpty(userData.email) || _.isEmpty(userData.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'email_or_password_is_required',
            )
        );
    } else {
        if (!isValidEmail(userData.email)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_email',
                )
            );
        }

        else if (!isValidPassword(userData.password)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_password',
                )
            );
        }
    }

    req.body.userData = userData;
    next();
}

module.exports = {
    loginUserValidation
}