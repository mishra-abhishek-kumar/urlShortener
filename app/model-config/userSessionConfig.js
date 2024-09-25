const db = require("../../models");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class UserSessionConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			loginTime: "loginTime",
			logoutTime: "logoutTime",
			userId: "userId",
		});
		this.model = db.userSession;
		this.modelName = db.userSession.name;
		this.tableName = db.userSession.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			loginTime: this.model.rawAttributes[this.fieldMapping.loginTime].field,
			logoutTime: this.model.rawAttributes[this.fieldMapping.logoutTime].field,
			userId: this.model.rawAttributes[this.fieldMapping.userId].field,
		});

		// this.filters = Object.freeze({
		// 	id: (id) => {
		// 		validateUuid(id, "user config");
		// 		return {
		// 			[this.fieldMapping.id]: {
		// 				[Op.eq]: id,
		// 			},
		// 		};
		// 	},
		// 	firstName: (firstName) => {
		// 		validateStringLength(firstName, "firstName", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.firstName]: {
		// 				[Op.like]: `%${firstName}%`,
		// 			},
		// 		};
		// 	},
		// 	lastName: (lastName) => {
		// 		validateStringLength(lastName, "lastName", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.lastName]: {
		// 				[Op.like]: `%${lastName}%`,
		// 			},
		// 		};
		// 	},
		// 	email: (email) => {
		// 		validateStringLength(email, "email", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.email]: {
		// 				[Op.like]: `%${email}%`,
		// 			},
		// 		};
		// 	},

		// 	lowerLimitUrls: (lowerLimitUrls) => {
		// 		// lowerLimitUrls = Number(lowerLimitUrls);
		// 		// isPositiveInteger(lowerLimitUrls);
		// 		if (!isNumber(lowerLimitUrls)) {
		// 			return {};
		// 		}
		// 		return {
		// 			[this.fieldMapping.noOfUrls]: {
		// 				[Op.gte]: lowerLimitUrls,
		// 			},
		// 		};
		// 	},

		// 	upperLimitUrls: (upperLimitUrls) => {
		// 		// upperLimitUrls = Number(upperLimitUrls);
		// 		// isPositiveInteger(upperLimitUrls);
		// 		if (!isNumber(upperLimitUrls)) {
		// 			return {};
		// 		}
		// 		return {
		// 			[this.fieldMapping.noOfUrls]: {
		// 				[Op.lte]: upperLimitUrls,
		// 			},
		// 		};
		// 	},
		// });

		// this.associations = Object.freeze({
		// 	url: "url",
		// 	payment: "payment",
		// });
	}
}
const userSessionConfig = new UserSessionConfig();
// deepFreeze(userConfig)

module.exports = userSessionConfig;
