const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class PaymentConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			paymentFor: "paymentFor",
			amountPaid: "amountPaid",
			paymentTime: "paymentTime",
			userId: "userId",
			urlId: "urlId",
		});
		this.model = db.Payment;
		this.modelName = db.Payment.name;
		this.tableName = db.Payment.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			paymentFor: this.model.rawAttributes[this.fieldMapping.paymentFor].field,
			amountPaid: this.model.rawAttributes[this.fieldMapping.amountPaid].field,
			paymentTime:
				this.model.rawAttributes[this.fieldMapping.paymentTime].field,
			userId: this.model.rawAttributes[this.fieldMapping.userId].field,
			urlId: this.model.rawAttributes[this.fieldMapping.urlId].field,
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
		// 	username: (username) => {
		// 		validateStringLength(username, "username", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.username]: {
		// 				[Op.like]: `%${username}%`,
		// 			},
		// 		};
		// 	},
		// 	name: (name) => {
		// 		validateStringLength(name, "name", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.name]: {
		// 				[Op.like]: `%${name}%`,
		// 			},
		// 		};
		// 	},
		// 	gender: (gender) => {
		// 		validateStringLength(gender, "gender", undefined, 255);
		// 		return {
		// 			[this.fieldMapping.gender]: {
		// 				[Op.like]: `%${gender}%`,
		// 			},
		// 		};
		// 	},
		// });
	}
}
const paymentConfig = new PaymentConfig();
// deepFreeze(userConfig)

module.exports = paymentConfig;
