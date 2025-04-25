/**
 * @author Md. Majedul Islam,
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description This middleware is used for Login validation
 * 
 */
const _ = require('lodash');
const { API_STATUS_CODE } = require('../consts/error-status');
const { setServerResponse } = require('../utilities/server-response');
const { isValidUsername, isValidPassword } = require('../utilities/user-data-validator');


/**
 * @description This function will validate user login data
 */
const loginUserValidation = async (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    if (_.isEmpty(user.username) || _.isEmpty(user.password)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'username_or_password_is_required',
            )
        );
    } else {
        if (!isValidUsername(user.username)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_username',
                )
            );
        }

        else if (!isValidPassword(user.password)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_password',
                )
            );
        }
    }

    req.body.user = user;
    next();
}

module.exports = {
    loginUserValidation
}