const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.BOOLEAN
      ? process.env.BOOLEAN.toLowerCase() === 'true'
      : false,
  },
  server: {
    host: '',
    port: Number(process.env.PORT) || 3000,
  },
  db: {
    address: process.env.MONGODB_URI
    // 'mongodb://root:example@db:27017/logserver',
    // address: 'mongodb://logUser:KxT5=NFu*e!5xCt_@185.94.96.66:27017/logserver',
  },
  // ...
};

module.exports = config;
