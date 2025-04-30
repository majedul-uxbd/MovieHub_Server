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


const express = require('express');
const movieRouter = express.Router();
const { authenticateToken } = require('../../middleware/authenticate-token');
const { addMovies } = require('../../main/add-movies');
const { isUserRoleAdmin } = require('../../consts/role-based-access');
const { getAllMovies } = require('../../main/get-all-movies');
const { getMovieById } = require('../../main/get-movie-by-id');
const { rateMovieById } = require('../../main/rate-movie-by-id');

/**
 * @description This API is used to add a new movie
 */
movieRouter.post("/add-movie",
    authenticateToken,
    isUserRoleAdmin,
    async (req, res) => {
        addMovies(req.body)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });


/**
* @description This API is used to get movie list
*/
movieRouter.get("/get-all-movies",
    async (req, res) => {
        getAllMovies()
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });


/**
* @description This API is used to get movie list
*/
movieRouter.post("/get-movie",
    async (req, res) => {
        const movieId = req.body.id;
        getMovieById(movieId)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });


/**
* @description This API is used to rate a movie
*/
movieRouter.post("/rate-movie",
    authenticateToken,
    async (req, res) => {
        const movieId = req.body.id;
        const rating = req.body.rating;
        const userId = req.auth.id;
        rateMovieById(movieId, userId, rating)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.data
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    });

module.exports = {
    movieRouter
}