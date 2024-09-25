const { StatusCodes } = require("http-status-codes");
const UserService = require("../service/UserService");

class UserController {
	constructor() {
		this.userService = new UserService();
	}

	async login(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside login`);

			const { email, password } = req.body;
			const { token, userId } = await this.userService.authenticateUser(
				settingsConfig,
				email,
				password
			);

			const data = await this.userService.createLoginSession(
				settingsConfig,
				req.body,
				userId
			);

			if (!data) {
				throw new Error("User Session cannot be started");
			}

			// res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });
			res.setHeader("Authorization", `Bearer ${token}`);
			res.setHeader("USERID", userId);
			res.setHeader("Access-Control-Expose-Headers", "Authorization");
			res.status(StatusCodes.OK).json({ token, userId });
		} catch (error) {
			next(error);
		}
	}

	async logout(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside logout`);

			// Extract userId from rawHeaders
			const userIdIndex = req.rawHeaders.indexOf("UserId");
			let userId;
			if (userIdIndex !== -1) {
				userId = req.rawHeaders[userIdIndex + 1];
			} else {
				throw new Error("UserId not found in headers");
			}

			// res.cookie(process.env.AUTH_COOKIE_NAME, "", {
			// 	expires: new Date(Date.now()),
			// });

			const data = await this.userService.createLogoutSession(
				settingsConfig,
				userId
			);

			if (!data) {
				throw new Error("User session cannot be terminated");
			}

			res.status(StatusCodes.OK).json("Logged out");
		} catch (error) {
			next(error);
		}
	}

	async createUser(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside createUser`);

			const user = await this.userService.getUserByEmail(
				settingsConfig,
				req.body.email
			);

			if (user.length != 0) {
				throw new Error("EmailID Already Taken");
			}

			const newUser = await this.userService.createUser(
				settingsConfig,
				req.body
			);

			res.status(StatusCodes.CREATED).json(newUser);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getAllUsers(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getAllUsers`);

			const queryParams = req.query;

			const { count, rows } = await this.userService.getAllUsers(
				settingsConfig,
				queryParams
			);

			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);

			return;
		} catch (error) {
			next(error);
		}
	}

	async updateParameter(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside updateParameter`);

			//  Extract userId from rawHeaders
			const userIdIndex = req.rawHeaders.indexOf("UserId");
			let userId;
			if (userIdIndex !== -1) {
				userId = req.rawHeaders[userIdIndex + 1];
			} else {
				throw new Error("UserId not found in headers");
			}

			req.body.userId = userId;

			const convertedBody = Object.fromEntries(
				Object.entries(req.body).map(([key, value]) => [
					key,
					parseInt(value, 10),
				])
			);

			const updatedBody = {
				freeUrlVisits: convertedBody.freeVisits,
				amtForExtraVisit: convertedBody.extraVisitPayment,
				extraVisitsGranted: convertedBody.extraVisits,
				amtForExtraUrls: convertedBody.urlPayment,
				extraUrlGranted: convertedBody.extraUrls,
				userId: convertedBody.userId,
			};

			const updatedParams = await this.userService.updateParameter(
				settingsConfig,
				updatedBody
			);

			if (!updatedParams) {
				throw new Error("cannot update new parameters for the users");
			}

			res.status(StatusCodes.CREATED).json(updatedParams);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getParameter(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getParameter`);

			const data = await this.userService.getParameter(settingsConfig);

			if (!data) {
				throw new Error("cannot fetch updated parameters for payment");
			}

			res.status(StatusCodes.OK).json(data);

			return;
		} catch (error) {
			next(error);
		}
	}

	async getMoreNoOfUrls(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserController] : Inside getMoreNoOfUrls`);

			const data = await this.userService.getMoreNoOfUrls(
				settingsConfig,
				req.body
			);

			if (!data) {
				throw new Error("Cannot buy more urls for the user");
			}

			res.status(StatusCodes.OK).json("Payment done successfully");
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
