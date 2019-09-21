// @ts-check
const { Logger } = require('./Logger');

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
  Logger.error(errObject.message);
}

function handleMongooseError(errObject) {
  Logger.error(errObject.message);
}

function handleRequestError(errObject) {
  Logger.error(errObject.message);
}

function handleValidatorError(errObject) {
  Logger.error(errObject.message);
}

function handleGeneralError(errObject) {
  if (errObject.code === 'ETELEGRAM') return handleTelegramError(errObject);
}
