const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { preloadAssociations } = require("../../../sequelize/association");
const { startTransaction } = require("../../../sequelize/transaction");
const {
	parseFilterQueries,
	parseLimitAndOffset,
	parseSelectFields,
} = require("../../../utils/request");
const userConfig = require("../../../model-config/userConfig");
const urlConfig = require("../../../model-config/urlConfig");
const paymentConfig = require("../../../model-config/paymentConfig");
const userSessionConfig = require("../../../model-config/userSessionConfig");
const adminUpdateConfig = require("../../../model-config/adminUpdateConfig");

class UserService {
	constructor() {}

	#associationMap = {
		url: {
			model: urlConfig.model,
			as: "url",
			include: {
				model: paymentConfig.model,
				as: "payment",
			},
		},
		payment: {
			model: paymentConfig.model,
			as: "payment",
		},
		userSession: {
			model: userSessionConfig.model,
			as: "userSession",
		},
		adminUpdate: {
			model: adminUpdateConfig.model,
			as: "adminUpdate",
		},
	};

	createAssociation(includeQuery) {
		let association = [];

		if (!Array.isArray(includeQuery)) {
			includeQuery = [includeQuery];
		}

		if (includeQuery?.includes(userConfig.associations.url)) {
			association.push(this.#associationMap.url);
		}

		if (includeQuery?.includes(userConfig.associations.payment)) {
			association.push(this.#associationMap.payment);
		}
	}

	async getUserByEmail(settingsConfig, email) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getUserByEmail`);

			const data = await userConfig.model.findAll({
				transaction: t,
				where: { email: email },
			});

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async createUser(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createUser`);

			let hashedPassword = await bcrypt.hash(body.password, 12);
			// body.id = uuidv4();
			body.password = hashedPassword;

			const data = await userConfig.model.create(body, { transaction: t });

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getAllUsers(settingsConfig, queryParams) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getAllUsers`);

			const includeQuery = queryParams.include || [];

			let associations = [];

			const attributesToReturn = {
				id: userConfig.fieldMapping.id,
				firstName: userConfig.fieldMapping.firstName,
				lastName: userConfig.fieldMapping.lastName,
				email: userConfig.fieldMapping.email,
				noOfUrls: userConfig.fieldMapping.noOfUrls,
				amtSpend: userConfig.fieldMapping.amtSpend,
			};

			let selectArray = parseSelectFields(queryParams, attributesToReturn);
			if (!selectArray) {
				selectArray = Object.values(attributesToReturn);
			}

			if (includeQuery) {
				associations = this.createAssociation(includeQuery, selectArray);
			}

			const data = await userConfig.model.findAndCountAll({
				transaction: t,
				...parseFilterQueries(queryParams, userConfig.filters),
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

	async authenticateUser(settingsConfig, email, password) {
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside authenticateUser`);

			let [myUser] = await this.getUserByEmail(settingsConfig, email);
			let userId = myUser.dataValues.id;

			if (myUser == undefined) {
				throw new Error("user Not Found");
			}

			let check = await bcrypt.compare(password, myUser.dataValues.password);
			if (!check) {
				throw new Error("Password Entered is incorrect");
			}

			let myobj = {
				userId: userId,
				email: myUser.dataValues.email,
				isAdmin: myUser.dataValues.isAdmin,
			};
			let token = jwt.sign(myobj, process.env.JWT_SECRET_KEY, {
				expiresIn: 60 * 60,
			});

			return { token, userId };
		} catch (error) {
			throw error;
		}
	}

	async createLoginSession(settingsConfig, body, userId) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createLoginSession`);

			body.userId = userId;
			body.loginTime = new Date();

			const data = await userSessionConfig.model.create(body, {
				transaction: t,
			});
			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async createLogoutSession(settingsConfig, userId) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside createLogoutSession`);

			// Find the latest entry for the given userId
			const latestSession = await userSessionConfig.model.findOne({
				where: { userId: userId },
				order: [["createdAt", "DESC"]], // Assuming createdAt holds the timestamp of session creation
				transaction: t,
			});

			if (!latestSession) {
				throw new Error("No session found for this user");
			}

			// Update the latest session entry
			const updatedData = await latestSession.update(
				{
					logoutTime: new Date(),
				},
				{ transaction: t }
			);

			await t.commit();
			return updatedData;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async updateParameter(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside updateParameter`);

			const data = await adminUpdateConfig.model.create(body, {
				transaction: t,
			});

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getParameter(settingsConfig) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getParameter`);

			const updatedParameter = await adminUpdateConfig.model.findOne({
				order: [["createdAt", "DESC"]],
				transaction: t,
			});

			await t.commit();

			return updatedParameter;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	async getMoreNoOfUrls(settingsConfig, body) {
		const t = await startTransaction();
		try {
			const logger = settingsConfig.logger;
			logger.info(`[UserService] : Inside getMoreNoOfUrls`);

			const data = await paymentConfig.model.create(body, { transaction: t });

			if (!data) {
				throw new Error("Unable to make payment");
			}

			const updatedParameters = await adminUpdateConfig.model.findOne({
				order: [["createdAt", "DESC"]],
				transaction: t,
			});

			const user = await userConfig.model.findOne({
				where: { id: parseInt(body.userId) },
				transaction: t,
			});

			const updatedUser = await userConfig.model.update(
				{
					maxNoOfUrl: updatedParameters.extraUrlGranted + user.maxNoOfUrl,
					amtSpend: user.amtSpend + updatedParameters.amtForExtraUrls,
				},

				{ where: { id: parseInt(body.userId) }, transaction: t }
			);

			await t.commit();
			return data;
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}
}

module.exports = UserService;
