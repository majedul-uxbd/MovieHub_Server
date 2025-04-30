/**
 * @author Md. Majedul Islam
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setServerResponse } = require("../utilities/server-response");
const { API_STATUS_CODE } = require("../consts/error-status");
const { pool } = require("../../_DB/db");


const userLoginQuery = async (authData) => {
    const query = `
	SELECT
        id,
        name,
        email,
        password,
        role
    FROM
        users
    WHERE
        email = ? AND
        is_active = ${1};
	`;
    const values = [
        authData.email,
    ];

    try {
        const [result] = await pool.query(query, values);
        return Promise.resolve(result[0]);
    } catch (error) {
        return Promise.reject(error);
    }
}

const generateToken = (userInfo) => {
    const token = jwt.sign({
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '90d'
    });

    return token;
}

/**
 * @param {{
 * email: string,
 * password: string
 * }} user 
 * @description This function is used to get user data and token
 * @returns 
 */
const getUserData = async (authData) => {
    try {
        userInfo = await userLoginQuery(authData);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!userInfo) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'user_not_found')
        );
    }

    const token = generateToken(userInfo);

    const userData = {
        token: token,
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role
    }
    return Promise.resolve(
        setServerResponse(
            API_STATUS_CODE.ACCEPTED,
            'user_login_successfully',
            userData
        )
    )
}
module.exports = {
    getUserData
}