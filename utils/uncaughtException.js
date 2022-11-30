module.exports = (server) => {
  process.on('uncaughtException', err => {
    console.log(err.name, err.message);

    if (server) {
      server.close(() => {
        console.log('Uncaught Exception!! Shutting down...');
        process.exit(1);
      });
    }
  });
};
