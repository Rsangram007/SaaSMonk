const express = require('express');
const reviewRouter = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');

// 1. Post a review
reviewRouter.post('/', async (req, res) => {
    try {
        const { movieName, reviewerName, rating, reviewComments } = req.body;
        const movie = await Movie.findOne({ movieName });

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const review = new Review({ reviewerName, rating, reviewComments, movie: movie._id });
        await review.save();

        // Add review to movie
        movie.reviews.push(review);
        await movie.save();

        // Recalculate average rating
        const averageRating = await calculateAverageRating(movie._id);
        movie.avgRating = averageRating;
        await movie.save();

        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /reviews/:id
reviewRouter.put('/:id', async (req, res) => {
    try {
        const { reviewerName, rating, reviewComments } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, {
            reviewerName,
            rating,
            reviewComments,
        }, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Recalculate average rating
        const movie = await Movie.findById(updatedReview.movie);
        const averageRating = await calculateAverageRating(movie._id);
        movie.avgRating = averageRating;
        await movie.save();

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE /reviews/:id
reviewRouter.delete('/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Recalculate average rating for the associated movie
        const movie = await Movie.findById(deletedReview.movie);
        const averageRating = await calculateAverageRating(movie._id);
        movie.avgRating = averageRating;
        await movie.save();

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Function to calculate average rating
 
async function calculateAverageRating(movieId) {
    const reviews = await Review.find({ movie: movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length || null;
}


module.exports = reviewRouter;
