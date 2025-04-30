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

const getAllMoviesQuery = async () => {
    const query = `
        SELECT 
            m.id, 
            m.title, 
            IFNULL(AVG(r.rating), 0) AS avg_rating
        FROM 
            movies m
        LEFT JOIN 
            ratings r ON m.id = r.movie_id
    `;
    try {
        const [result] = await pool.query(query);
        if (result && result.length > 0) {
            return result.map((movie) => ({
                id: movie.id,
                title: movie.title,
                avg_rating: parseFloat(movie.avg_rating) || 0,
            }));
        }

        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/** 
 * @description This function is get all movies
 */
const getAllMovies = async () => {
    try {
        const movieData = await getAllMoviesQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.CREATED,
                'get_data_successfully',
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
    getAllMovies
}