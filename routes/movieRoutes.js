const express = require('express');
const movieRouter = express.Router();
const Movie = require('../models/Movie');

// 1. Get all movies
movieRouter.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().populate('reviews');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Post a movie
movieRouter.post('/', async (req, res) => {
    try {
        const { movieName, releaseDate } = req.body;
        const newMovie = new Movie({ movieName, releaseDate });
        await newMovie.save();
        res.json(newMovie);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3. Get movie details by ID
movieRouter.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('reviews');
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// PUT /movies/:id
movieRouter.put('/:id', async (req, res) => {
    try {
        const { movieName, releaseDate } = req.body;
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
            movieName,
            releaseDate,
        }, { new: true });
        
        if (!updatedMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE /movies/:id
movieRouter.delete('/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!deletedMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = movieRouter;
