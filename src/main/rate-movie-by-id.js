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

const _ = require("lodash");
const { setServerResponse } = require("../utilities/server-response");
const { API_STATUS_CODE } = require("../consts/error-status");
const { pool } = require("../../_DB/db");

const rateMovieByIdQuery = async (movieId, userId, rating) => {
    const query = `
        INSERT INTO 
            ratings 
            (
                movie_id, 
                user_id, 
                rating
            )
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            rating = VALUES(rating);
    `;
    try {
        const [result] = await pool.query(query, [movieId, userId, rating]);
        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/** 
 * @description This function is used to get movie by id
 */
const rateMovieById = async (movieId, userId, rating) => {
    try {
        const movieData = await rateMovieByIdQuery(movieId, userId, rating);
        if (movieData === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.NOT_FOUND,
                    'movie_not_found',
                )
            )
        }
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.CREATED,
                'movie_rated_successfully',
                movieData
            )
        )
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'internal_server_error',
            )
        )
    }
}

module.exports = {
    rateMovieById
}