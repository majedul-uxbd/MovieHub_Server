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


const userLoginQuery = async (user) => {
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
        user.email,
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
const userLogin = async (user) => {
    let userInfo;

    if (!user.email || !user.password) {
        Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'email_or_password_is_required'
            )
        );
    }
    try {
        userInfo = await userLoginQuery(user);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!userInfo) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'invalid_email_or_password')
        );
    }

    let isPasswordCorrect;
    try {
        isPasswordCorrect = await bcrypt.compare(user.password, userInfo.password);  //compare user passwords
    } catch (error) {
        // console.log("🚀 ~ userLogin ~ error:", error)
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'invalid_password')
        );
    }

    if (!isPasswordCorrect) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'invalid_password')
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
            'User logged in successfully',
            userData
        )
    )
}
module.exports = {
    userLogin
}