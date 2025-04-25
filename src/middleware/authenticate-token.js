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

const jwt = require('jsonwebtoken');
const { pool } = require('../../_DB/db');
const { API_STATUS_CODE } = require('../consts/error-status');
const { setServerResponse } = require('../utilities/server-response');


const checkUserId = async (
	id,
	email
) => {
	const query = `
  	SELECT
		*
	FROM
		users
	WHERE
		id = ? AND
		email = ? AND
		is_active = ${1};
  	`;

	const values = [
		id,
		email
	]

	try {
		const [result] = await pool.query(query, values);
		if (result.length > 0) {
			return true;
		}
		return false;
	} catch (error) {
		return error
	}

};


/**
 * @description This function is used to to verify user jwt token
 */
const authenticateToken = async (req, res, next) => {
	let user;
	const authHeader = (req.headers['authorization'] || req.body.token) + '';

	if (authHeader === null) {
		return res.status(API_STATUS_CODE.UNAUTHORIZED).send({
			status: 'failed',
			message: 'unauthorized_user'
		})
	} else {
		try {
			let token = authHeader.replace(/^[B|b]earer\s+/, '');

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
				if (err) {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'invalid_token'
						)
					);
				}

				const { id, email } = user;

				const isUserExist = await checkUserId(id, email);
				if (isUserExist) {
					req.auth = {
						id,
						name,
						email,
						role
					};
					// console.warn('next:', user);

					next();
				} else {
					return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
						setServerResponse(
							API_STATUS_CODE.UNAUTHORIZED,
							'invalid_user'
						)
					);
				}
			});
		} catch (error) {
			return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
				setServerResponse(
					API_STATUS_CODE.UNAUTHORIZED,
					'invalid_user'
				)
			);
		}
	};
}
module.exports = {
	authenticateToken
};
