// @ts-check
const ErrorMap = {
  TelegramError: handleTelegramError,
  MongooseError: handleMongooseError,
  RequestError: handleRequestError,
  Error: handleGeneralError,
};

class AppError {
  static handle(errObject) {
    ErrorMap[errObject.name](errObject);
  }
}

module.exports = AppError;

function handleTelegramError(errObject) {
  console.error('\n\nTelegramError');
  console.log(errObject.message);
}

function handleMongooseError(errObject) {
  console.error('\n\nMongooseError');
  console.log(errObject.message);
}

function handleRequestError(errObject) {
  console.error('\n\nRequestError');
  console.log(errObject.message);
}

function handleGeneralError(errObject) {
  console.error('\n\nGeneral Error');
  console.log(errObject.message);
}
