const mongoose = require('mongoose');
const dotenv = require('dotenv');
const uncaughtException = require('./utils/uncaughtException');

uncaughtException();

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_DEV.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {console.log('DB connection successful!');});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

uncaughtException(server);
