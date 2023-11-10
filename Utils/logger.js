const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error_logging.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined_error.log' })
  ]
});

if ('production' == 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
