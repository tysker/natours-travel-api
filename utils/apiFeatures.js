class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString }; // Making a hard copy of the req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Query params that should be excluded in the queryObject
    excludedFields.forEach((el) => delete queryObj[el]); // Delete object properties

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // FRA { difficulty: 'easy', duration: { 'lte': '4' } } TIL { difficulty: 'easy', duration: { '$lte': '4' } }
    // gte = greater then equal, lte = lower then equal ....
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // localhost:3000/api/v1/tours?sort=-price,-ratingsAverage,duration
      const sortBy = this.queryString.sort.replace(/,/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  //Field Limiting (also called projecting)
  limitFields() {
    if (this.queryString.fields) {
      // localhost:3000/api/v1/tours?fields=name,duration
      const fields = this.queryString.fields.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    } else {
      // by default excluding fields
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //https://codeburst.io/javascript-what-is-short-circuit-evaluation-ff22b2f5608c
    const page = this.queryString.page * 1 || 1; // Convert string to number and then set default to 1
    const limit = this.queryString.limit * 1 || 100; // Convert string to number and then set default to 10
    const skip = (page - 1) * limit;

    // localhost:3000/api/v1/tours?page=2&limit=10 (1-10 on page 1 and 11-20 on page 2)
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
