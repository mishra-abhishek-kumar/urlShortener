const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");
const { isPositiveInteger, isNumber } = require("../utils/number");

class UserConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			firstName: "firstName",
			lastName: "lastName",
			email: "email",
			password: "password",
			isAdmin: "isAdmin",
			dob: "dob",
			gender: "gender",
			noOfUrls: "noOfUrls",
			maxNoOfUrl: "maxNoOfUrl",
			amtSpend: "amtSpend",
			isBlocked: "isBlocked",
		});
		this.model = db.User;
		this.modelName = db.User.name;
		this.tableName = db.User.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
			lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
			email: this.model.rawAttributes[this.fieldMapping.email].field,
			password: this.model.rawAttributes[this.fieldMapping.password].field,
			isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,
			dob: this.model.rawAttributes[this.fieldMapping.dob].field,
			gender: this.model.rawAttributes[this.fieldMapping.gender].field,
			noOfUrls: this.model.rawAttributes[this.fieldMapping.noOfUrls].field,
			maxNoOfUrl: this.model.rawAttributes[this.fieldMapping.maxNoOfUrl].field,
			amtSpend: this.model.rawAttributes[this.fieldMapping.amtSpend].field,
			isBlocked: this.model.rawAttributes[this.fieldMapping.isBlocked].field,
		});

		this.filters = Object.freeze({
			id: (id) => {
				validateUuid(id, "user config");
				return {
					[this.fieldMapping.id]: {
						[Op.eq]: id,
					},
				};
			},
			firstName: (firstName) => {
				validateStringLength(firstName, "firstName", undefined, 255);
				return {
					[this.fieldMapping.firstName]: {
						[Op.like]: `%${firstName}%`,
					},
				};
			},
			lastName: (lastName) => {
				validateStringLength(lastName, "lastName", undefined, 255);
				return {
					[this.fieldMapping.lastName]: {
						[Op.like]: `%${lastName}%`,
					},
				};
			},
			email: (email) => {
				validateStringLength(email, "email", undefined, 255);
				return {
					[this.fieldMapping.email]: {
						[Op.like]: `%${email}%`,
					},
				};
			},

			lowerLimitUrls: (lowerLimitUrls) => {
				// lowerLimitUrls = Number(lowerLimitUrls);
				// isPositiveInteger(lowerLimitUrls);
				if (!isNumber(lowerLimitUrls)) {
					return {};
				}
				return {
					[this.fieldMapping.noOfUrls]: {
						[Op.gte]: lowerLimitUrls,
					},
				};
			},

			upperLimitUrls: (upperLimitUrls) => {
				// upperLimitUrls = Number(upperLimitUrls);
				// isPositiveInteger(upperLimitUrls);
				if (!isNumber(upperLimitUrls)) {
					return {};
				}
				return {
					[this.fieldMapping.noOfUrls]: {
						[Op.lte]: upperLimitUrls,
					},
				};
			},
		});

		this.associations = Object.freeze({
			url: "url",
			payment: "payment",
			userSession: "userSession",
			adminUpdate: "adminUpdate",
		});
	}
}
const userConfig = new UserConfig();
// deepFreeze(userConfig)

module.exports = userConfig;
