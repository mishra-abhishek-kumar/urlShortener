const { StatusCodes } = require("http-status-codes");
const UrlService = require("../service/UrlService");

class UrlController {
	constructor() {
		this.urlService = new UrlService();
	}

	async createURL(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside createURL`);

			const { userId } = req.params;

			const url = await this.urlService.getExistingLongtUrl(
				settingsConfig,
				req.body.longUrl,
				userId
			);

			if (url.length != 0) {
				throw new Error("The URL already exists for in the records");
			}

			const newURL = await this.urlService.createURL(settingsConfig, req);

			res.status(StatusCodes.CREATED).json(newURL);
		} catch (error) {
			next(error);
		}
	}

	async getAllURL(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getAllURL`);

			const { userId } = req.params;

			// is user admin or owner?
			if (!req.user.isAdmin && userId != req.user.userId) {
				logger.warn(
					`[UrlController] Unauthorized access attempt by userId: ${req.user.userId}`
				);
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Unauthorized access" });
			}

			const queryParams = req.query;
			logger.info(
				`[UrlController] : UserId: ${userId}, QueryParams: ${JSON.stringify(
					queryParams
				)}`
			);

			const { count, rows } = await this.urlService.getAllURL(
				settingsConfig,
				userId,
				queryParams
			);

			res.set("X-Total-Count", count);
			res.status(StatusCodes.OK).json(rows);
		} catch (error) {
			next(error);
		}
	}

	async getOneUrl(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getOneUrl`);

			const { shortUrl } = req.params;

			const updatedShortUrl = `http://127.0.0.1:20200/${shortUrl}`;

			const data = await this.urlService.getExistingShortUrl(
				settingsConfig,
				updatedShortUrl
			);

			if (!data) {
				throw new Error("The short URL entered is invalid!");
			}

			const urlId = await this.urlService.getOneUrl(
				settingsConfig,
				updatedShortUrl
			);

			if (!urlId) {
				throw new Error("Cannot find the given shortUrl");
			}

			res.status(StatusCodes.OK).json(urlId);
		} catch (error) {
			next(error);
		}
	}

	async countUrlVisit(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside countUrlVisit`);

			const shortUrl = `http://127.0.0.1:20200/${req.params.shortUrl}`;

			// Get the existing short URL data
			const data = await this.urlService.getExistingShortUrl(
				settingsConfig,
				shortUrl
			);

			if (data.length === 0) {
				throw new Error("The short URL entered is invalid!");
			}

			// Call the countUrlVisit method and destructure the returned object
			const { updatedData, success } = await this.urlService.countUrlVisit(
				settingsConfig,
				shortUrl
			);

			if (success && updatedData) {
				// Redirect to the long URL if successful
				return res.redirect(updatedData[0].longUrl);
			}

			// If the URL has expired, redirect to the URL-expired page
			return res.redirect("http://127.0.0.1:3000/url-expired");
		} catch (error) {
			next(error);
		}
	}

	async getMoreNoOfUrlVisits(settingsConfig, req, res, next) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getMoreNoOfUrlVisits`);

			const data = await this.urlService.getMoreNoOfUrlVisits(
				settingsConfig,
				req.body
			);

			if (!data) {
				throw new Error("Cannot buy more visits to the url");
			}

			res.status(StatusCodes.OK).json("Payment done successfully");
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UrlController();
