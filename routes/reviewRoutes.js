const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

const {
  getReview,
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUsersIds,
} = reviewController;

router.use(authController.protect);

router
  .route('/')
  .get(getAllReviews)
  .post(authController.restrictTo('user'), setTourUsersIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview)
  .delete(authController.restrictTo('user', 'admin'), deleteReview);

module.exports = router;
