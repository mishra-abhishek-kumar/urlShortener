class URLShortnerError extends Error {
	constructor(statusCode, message, specificMessage) {
		this.statusCode = statusCode;
		this.specificMessage = specificMessage;
		super(message);
	}
}
module.exports = URLShortnerError;
