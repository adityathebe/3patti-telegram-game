// @ts-check
const { logger } = require('./Logger');

const ErrorMap = {
  TelegramError: handleTelegramError,
  MongooseError: handleMongooseError,
  RequestError: handleRequestError,
  ValidationError: handleValidatorError,
  Error: handleGeneralError,
};

class AppError {
  static handle(errObject) {
    ErrorMap[errObject.name](errObject);
  }
}

module.exports = AppError;

function handleTelegramError(errObject) {
  logger.error(errObject.message);
}

function handleMongooseError(errObject) {
  logger.error(errObject.message);
}

function handleRequestError(errObject) {
  logger.error(errObject.message);
}

function handleValidatorError(errObject) {
  logger.error(errObject.message);
}

function handleGeneralError(errObject) {
  if (errObject.code === 'ETELEGRAM') return handleTelegramError(errObject);
}
