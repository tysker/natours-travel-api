const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { protect } = require('../controllers/authController');

const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMyInfo,
  deleteMyInfo
} = userController;

const { signup, login, forgotPassword, resetPassword, updatedPassword } = authController;

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatedPassword', protect, updatedPassword);

router.patch('/updateMyInfo', protect, updateMyInfo);
router.delete('/deleteMyInfo', protect, deleteMyInfo);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
