const { StatusCodes } = require("http-status-codes");
// const UserService = require("../service/UserService");
const { checkJwtHS256 } = require("../../../middleware/authService");

class AuthController {
	constructor() {
		// this.userService = new UserService();
	}

	async isAdmin(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[AuthController] : Inside isAdmin authcontroller`);

			const payload = checkJwtHS256(settingsConfig, req, res, next);

			if (!payload.isAdmin) {
				throw new Error("Not an Admin");
			}
			// res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });
			res.setHeader("Access-Control-Expose-Headers", "Authorization");
			res.status(StatusCodes.OK).json({ isAdmin: !payload.isAdmin });
		} catch (error) {
			next(error);
		}
	}
	async isUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[AuthController] : Inside isUser authcontroller`);

			const payload = checkJwtHS256(settingsConfig, req, res, next);

			req.user = payload;

			if (payload.isUser) {
				throw new Error("Not an User");
			}
			// res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });
			res.setHeader("Access-Control-Expose-Headers", "Authorization");
			res.status(StatusCodes.OK).json({ isUser: !payload.isUser });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AuthController();
