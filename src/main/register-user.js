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

const { pool } = require("../../_DB/db");
const bcrypt = require("bcrypt");
const { API_STATUS_CODE } = require("../consts/error-status");
const { setServerResponse } = require("../utilities/server-response");


const checkDuplicateEmail = async (email) => {
    const _query = `
    SELECT 
        email
    FROM
        users
    WHERE
        email = ?;
`;

    const _values = [
        email
    ];

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        // console.log("🚀 ~ userLoginQuery ~ error:", error)
        return Promise.reject(error);
    }
};

const insertUserQuery = async (userData) => {
    const query = `
        INSERT INTO 
            users 
            (
                name,   
                email, 
                password
            ) 
        VALUES (?, ?, ?)`;

    const values = [
        userData.name,
        userData.email,
        userData.password
    ];
    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * name: string,
 * email: string,
 * password: string
 * }} userData 
 * @description This function is used to register a new user 
 */
const registerUser = async (userData) => {
    const password = userData.password;

    let _password;
    try {
        const isDuplicateEmail = await checkDuplicateEmail(userData.email);
        if (isDuplicateEmail === true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'email_already_exist'
                )
            );
        }
        _password = await bcrypt.hash(password, 10);
        const userNewData = { ...userData, password: _password };
        const insertUser = await insertUserQuery(userNewData);
        if (insertUser === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'user_registered_successfully',
                )
            )
        }
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'internal_server_error',
            )
        )
    }
};

module.exports = {
    registerUser
}