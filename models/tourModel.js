const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: {
      //   validator: function(val) {
      //     return validator.isAlpha( val, 'en-US', { ignore: ' '})
      //   },
      //   message: 'Name should only contain characters'
      // }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], //Array of Strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get( function() {
  return this.duration / 7;
})

// DOCUMENT MIDDLEWARE. runs before .save() and .create() ( not with insertMany() )
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next();
})

tourSchema.pre('save', function(next) {
  console.log("Will save document.....");
  next();
})

// DOCUMENT MIDDLEWARE.
// runs after .save() and .create()
tourSchema.post('save', function(doc, next) {
  console.log("DOCUMENT MIDDLEWARE POST!");
  next();
})

// QUERY MIDDLEWARE
// points not to the current document, but to the current query
// reg ex used for find... (find, finOne, findAll...)
tourSchema.pre(/^find/, function(  next) {
  this.find({secretTour: {$ne: true}})
  // to verify how long a query took. see below for second Date property
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function(  docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline());
  next();
})

// With a model name, it is convention to write them with first letter uppercase
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
