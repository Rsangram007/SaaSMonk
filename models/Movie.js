const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    avgRating: {
        type: Number,
        default: null,
        min: 1,
        max: 10,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
});

module.exports = mongoose.model('Movie', MovieSchema);
