const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}


exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // Build query
    // 1a) Filtering
    const queryObj = { ...req.query }; // Making a hard copy of the req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Query params that should be excluded in the queryObject
    excludedFields.forEach(el => delete queryObj[el]); // delete object properties

    // 1b) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // FRA { difficulty: 'easy', duration: { 'lte': '4' } } TIL { difficulty: 'easy', duration: { '$lte': '4' } }
    // gte = greater then equal, lte = lower then equal ....
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // https://mongoosejs.com/docs/api/query.html

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      // localhost:3000/api/v1/tours?sort=-price,-ratingsAverage,duration
      const sortBy = req.query.sort.replace(/,/g, ' ');
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    // 3) Field Limiting (also called projecting)
    if (req.query.fields) {
    // localhost:3000/api/v1/tours?fields=name,duration
      const fields = req.query.fields.replace(/,/g, ' ');
      query = query.select(fields)
    } else {
      // by default excluding fields
      query = query.select('-__v')
    }

    // 4) Pagination
    //https://codeburst.io/javascript-what-is-short-circuit-evaluation-ff22b2f5608c
    const page = req.query.page * 1 || 1; // convert string to number and then set default to 1
    // set a default of 10 results to limit bandwidth
    const limit = req.query.limit * 1 || 10; // convert string to number and then set default to 10
    const skip = (page -1) * limit;

    // localhost:3000/api/v1/tours?page=2&limit=10 (1-10 on page 1 and 11-20 on page 2)
    query = query.skip(skip).limit(limit);

    if(req.query.page) {
      const numTours = await Tour.countDocuments()
      if(skip >= numTours) throw new Error('This page does not exist') // will be caught in the catch method below
    }

    // 5) Execute query
    const tours = await query;

    // 6) Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // New document will be sent back
      runValidators: true,
    });
    res.status(200).json({
      status: 'succes',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'succes',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
