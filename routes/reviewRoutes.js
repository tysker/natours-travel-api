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

const { protect, restrictTo } = authController;

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUsersIds, createReview);

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
