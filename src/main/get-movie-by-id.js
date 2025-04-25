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

const getMovieByIdQuery = async (id) => {
    const query = `
        SELECT 
            m.id, 
            m.title, 
            IFNULL(AVG(r.rating), 0) AS avg_rating
        FROM 
            movies m
        LEFT JOIN 
            ratings r ON m.id = r.movie_id
        WHERE 
            m.id = ?;
    `;
    try {
        const [result] = await pool.query(query, id);
        if (result[0].id !== null) {
            return {
                id: result[0].id,
                title: result[0].title,
                avg_rating: parseFloat(result[0].avg_rating) || 0,
            };
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/** 
 * @description This function is used to get movie by id
 */
const getMovieById = async (id) => {
    try {
        const movieData = await getMovieByIdQuery(id);
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
                'get_data_successfully',
                movieData
            )
        )
    } catch (error) {
        console.warn('🚀 ~ getMovieById ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'internal_server_error',
            )
        )
    }
}

module.exports = {
    getMovieById
}