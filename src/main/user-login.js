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


const userLoginQuery = async (user) => {
    const query = `
	SELECT
        id,
        username,
        role
    FROM
        users
    WHERE
        username = ? AND
        is_active = ${1};
	`;
    const values = [
        user.username,
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
        role: userInfo.role,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '90d'
    });

    return token;
}

/**
 * @param {{
 * module_id: string,
 * username: string,
 * password: string
 * }} user 
 * @description This function is used to get user data and token
 * @returns 
 */
const userLogin = async (user) => {
    let userInfo;

    if (!user.username || !user.password) {
        Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'username_or_password_is_required')
        );
    }
    try {
        userInfo = await userLoginQuery(user);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!userInfo) {
        return Promise.reject(
            setServerResponse(API_STATUS_CODE.BAD_REQUEST, 'username_or_password_is_required')
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
        role: userInfo.role
    }
    // console.warn('🚀 ~ file: user-login.js:105 ~ userLogin ~ userData:', userData);
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