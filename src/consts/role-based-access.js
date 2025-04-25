/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const { setServerResponse } = require("../utilities/server-response");
const { API_STATUS_CODE } = require("./error-status");


const userRole = Object.freeze({
    ADMIN: "admin",
    USER: "user"
});

/**
 *@description This function will check whether the user role is Admin or not
 */
const isUserRoleAdmin = (req, res, next) => {
    const userData = req.auth;
    if (userData.role === userRole.ADMIN) {
        next();
    } else {
        return res.status(API_STATUS_CODE.NOT_ACCEPTABLE).send(
            setServerResponse(
                API_STATUS_CODE.NOT_ACCEPTABLE,
                'user_role_is_not_allowed_for_the_request'
            )
        );
    }
};

module.exports = {
    isUserRoleAdmin
}