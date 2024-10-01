const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    reviewComments: {
        type: String,
        required: true,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
});

module.exports = mongoose.model('Review', ReviewSchema);
