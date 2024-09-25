const URLShortnerError = require("./baseError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends URLShortnerError {
	constructor(specificMessage) {
		super(StatusCodes.NOT_FOUND, "Not found error", specificMessage);
	}
}
class UnauthorizedError extends URLShortnerError {
	constructor(specificMessage) {
		super(StatusCodes.UNAUTHORIZED, "Unauthorized Error", specificMessage);
	}
}
class ValidationError extends URLShortnerError {
	constructor(specificMessage) {
		super(StatusCodes.BAD_REQUEST, "Validation Error", specificMessage);
	}
}

module.exports = { NotFoundError, UnauthorizedError, ValidationError };
