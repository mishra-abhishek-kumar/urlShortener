const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { preloadAssociations } = require("../../../sequelize/association");
const { startTransaction } = require("../../../sequelize/transaction");
const {
	parseFilterQueries,
	parseLimitAndOffset,
	parseSelectFields,
} = require("../../../utils/request");
const randomstring = require("randomstring");
const { URL } = require("url");
const axios = require("axios");
const urlConfig = require("../../../model-config/urlConfig");
const paymentConfig = require("../../../model-config/paymentConfig");
const userConfig = require("../../../model-config/userConfig");
const adminUpdateConfig = require("../../../model-config/adminUpdateConfig");

class UrlService {
	constructor() {}

	#associationMap = {
		payment: {
			model: paymentConfig.model,
			as: "payment",
		},
	};

	createAssociation(includeQuery) {
		let association = [];

		if (!Array.isArray(includeQuery)) {
			includeQuery = [includeQuery];
		}

		if (includeQuery?.includes(urlConfig.associations.payment)) {
			association.push(this.#associationMap.payment);
		}
	}

	async isValidUrl(longUrl) {
		try {
			// Validate the format of the URL
			const url = new URL(longUrl);

			// Check if the URL is reachable by sending a HEAD request
			const response = await axios.head(longUrl);

			// If the URL returns a valid status code (2xx or 3xx), it is reachable
			return response.status >= 200 && response.status < 400;
		} catch (error) {
			return false;
		}
	}

	async createShortURL(longUrl) {
		if (!(await this.isValidUrl(longUrl))) {
			throw new Error("Invalid or unreachable URL");
		}

		let shortUrl = "";
		try {
			shortUrl = randomstring.generate({
				length: 12,
				charset: "alphabetic",
			});
		} catch (error) {
			console.error("Error generating short URL:", error);
			throw error;
		}

		return shortUrl;
	}

	async getExistingLongtUrl(settingsConfig, longUrl, userId) {
		const transaction = await startTransaction();

		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getExistingLongtUrl`);

			// const shortUrl = await this.createShortURL(longUrl);

			const data = await urlConfig.model.findAll({
				transaction: transaction,
				where: { longUrl: longUrl, userId: userId },
			});

			await transaction.commit();
			return data;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async createURL(settingsConfig, req) {
		const transaction = await startTransaction();
		try {
			const { userId } = req.params;

			const logger = settingsConfig.logger;
			logger.info(`[UrlService] : Inside createURL`);

			const shortUrl = await this.createShortURL(req.body.longUrl);

			req.body.shortUrl = `http://127.0.0.1:20200/${shortUrl}`;
			req.body.userId = userId;

			//check no of urls
			const count = await urlConfig.model.count({ where: { userId: userId } });

			const user = await userConfig.model.findAll({
				where: { id: userId },
			});

			if (count >= user[0].maxNoOfUrl) {
				throw new Error(
					"You have reached the maximum usage to creating URL, Please buy a plan to add more URL"
				);
			}

			const data = await urlConfig.model.create(req.body, {
				transaction: transaction,
			});

			const updatedFreeHit = await adminUpdateConfig.model.findOne({
				order: [["createdAt", "DESC"]],
				transaction: transaction,
			});

			const updatedUrlData = await urlConfig.model.update(
				{
					maxNoOfVisit: updatedFreeHit.freeUrlVisits,
				},

				{ where: { shortUrl: req.body.shortUrl }, transaction: transaction }
			);

			const increaseURLCount = await userConfig.model.update(
				{ noOfUrls: user[0].noOfUrls + 1 },
				{ where: { id: userId }, transaction: transaction }
			);

			const updatedData = await urlConfig.model.findOne({
				where: { userId: userId },
				transaction: transaction,
			});

			await transaction.commit();
			return updatedData;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async getAllURL(settingsConfig, userId, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getAllURL`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: urlConfig.fieldMapping.id,
				longUrl: urlConfig.fieldMapping.longUrl,
				shortUrl: urlConfig.fieldMapping.shortUrl,
				noOfTimesVisited: urlConfig.fieldMapping.noOfTimesVisited,
				isRenewed: urlConfig.fieldMapping.isRenewed,
				isExpired: urlConfig.fieldMapping.isExpired,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery, selectArray);
			}

			const data = await urlConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, urlConfig.filters, {
					userId: userId,
				}),
				attributes: selectArray,
				...parseLimitAndOffset(queryParams),
				...preloadAssociations(associations),
			});

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getOneUrl(settingsConfig, shortUrl) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlController] : Inside getOneUrl`);

			const data = await urlConfig.model.findOne({
				where: { shortUrl: shortUrl },
				transaction: t,
			});

			if (!data) {
				throw new Error("No such URL found");
			}

			await t.commit();
			return data.id;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getExistingShortUrl(settingsConfig, shortUrl) {
		const transaction = await startTransaction();

		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlService] : Inside getExistingShortUrl`);

			const data = await urlConfig.model.findOne({
				transaction: transaction,
				where: { shortUrl: shortUrl },
			});

			await transaction.commit();
			return data;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async countUrlVisit(settingsConfig, shortUrl) {
		const transaction = await startTransaction();

		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlService] : Inside countUrlVisit`);

			//to check visited count
			const data = await urlConfig.model.findAll({
				where: { shortUrl: shortUrl },
			});

			if (data[0].noOfTimesVisited >= data[0].maxNoOfVisit) {
				await urlConfig.model.update(
					{ isExpired: true },
					{ where: { shortUrl: shortUrl } }
				);
				return { updatedData: null, success: false };
			}

			const increaseVisitedCount = await urlConfig.model.update(
				{ noOfTimesVisited: data[0].noOfTimesVisited + 1 },
				{ where: { shortUrl: shortUrl }, transaction: transaction }
			);

			const updatedData = await urlConfig.model.findAll({
				where: { shortUrl: shortUrl },
			});

			await transaction.commit();
			return { updatedData, success: true };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async getMoreNoOfUrlVisits(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UrlService] : Inside getMoreNoOfUrlVisits`);

			const data = await paymentConfig.model.create(body, { transaction: t });

			if (!data) {
				throw new Error("Unable to make payment");
			}

			console.log("I am here>>>>>>>>>>>>>>>.", data);

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}

module.exports = UrlService;
