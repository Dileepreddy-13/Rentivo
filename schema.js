const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
    title: joi.string().required(),
    description: joi.string().allow(''),
    image: joi.object({
        url: joi.string().uri().allow(''),
        filename: joi.string().allow('')
    }).optional(),
    price: joi.number().required().min(0),
    country: joi.string().required(),
    location: joi.string().required()
    }).required()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required()
    }).required()
});

module.exports.userSchema = joi.object({
    user: joi.object({
        username: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required()
    }).required()
});