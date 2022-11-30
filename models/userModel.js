'use strict';
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      validate: {
        validator: function(email) {
          return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
        },
        message: props => `${props.value} is not a valid email address`,
      },
      required: [true, 'Email address validation failed'],
      unique: true,
      lowercase: true,
    },
    photo: String,
    password: {
      type: String,
      require: [true, 'Please provide a password'],
      minlength: [8, 'A password must have more or equal then 10 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, 'Please provide a password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: `Passwords are not the same!`,
      },
    },
  },
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
// instant method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
