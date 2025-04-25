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

const addMovieDataQuery = async (movieData) => {
    const query = `
        INSERT INTO
            movies
            (title)
        VALUES
            (?);
    `;
    const values = [movieData.title];
    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows > 0) {
            return true;
        } return false
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {{
 * title: string
 * }} movieData 
 * @description This function is used to add a new movie 
 */
const addMovies = async (movieData) => {
    if (_.isEmpty(movieData)) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'movie_data_is_required'
            )
        )
    }
    try {
        const isInserted = await addMovieDataQuery(movieData);
        if (isInserted === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.CREATED,
                    'movie_added_successfully'
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
}

module.exports = {
    addMovies
}