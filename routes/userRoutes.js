const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMyInfo,
  deleteMyInfo,
  getMe,
} = userController;

const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatedPassword,
  restrictTo,
} = authController;

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updatedPassword', updatedPassword);

router.get('/me', getMe, getUser);
router.patch('/updateMyInfo', updateMyInfo);
router.delete('/deleteMyInfo', deleteMyInfo);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
