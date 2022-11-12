// Only express/api related code
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // For getting the request body
app.use(express.static(`${__dirname}/public`)); // To get static files like images, html... localhost:3000/img/imageName.png

app.use((req, res, next) => { // Just for testing
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => { // Set the request time
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
