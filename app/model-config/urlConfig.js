const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");
const { isPositiveInteger, isNumber } = require("../utils/number");
const { isBoolean } = require("../utils/boolean");

class UrlConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			longUrl: "longUrl",
			shortUrl: "shortUrl",
			noOfTimesVisited: "noOfTimesVisited",
			maxNoOfVisit: "maxNoOfVisit",
			isRenewed: "isRenewed",
			isExpired: "isExpired",
			userId: "userId",
		});
		this.model = db.Url;
		this.modelName = db.Url.name;
		this.tableName = db.Url.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			longUrl: this.model.rawAttributes[this.fieldMapping.longUrl].field,
			shortUrl: this.model.rawAttributes[this.fieldMapping.shortUrl].field,
			noOfTimesVisited:
				this.model.rawAttributes[this.fieldMapping.noOfTimesVisited].field,
			maxNoOfVisit:
				this.model.rawAttributes[this.fieldMapping.maxNoOfVisit].field,
			isRenewed: this.model.rawAttributes[this.fieldMapping.isRenewed].field,
			isExpired: this.model.rawAttributes[this.fieldMapping.isExpired].field,
			userId: this.model.rawAttributes[this.fieldMapping.userId].field,
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
			longUrl: (longUrl) => {
				validateStringLength(longUrl, "longUrl", undefined, 255);
				return {
					[this.fieldMapping.longUrl]: {
						[Op.like]: `%${longUrl}%`,
					},
				};
			},
			shortUrl: (shortUrl) => {
				validateStringLength(shortUrl, "shortUrl", undefined, 255);
				return {
					[this.fieldMapping.shortUrl]: {
						[Op.like]: `%${shortUrl}%`,
					},
				};
			},

			lowerLimit: (lowerLimit) => {
				if (!isNumber(lowerLimit)) {
					return {};
				}
				return {
					[this.fieldMapping.noOfTimesVisited]: {
						[Op.gte]: lowerLimit,
					},
				};
			},

			upperLimit: (upperLimit) => {
				if (!isNumber(upperLimit)) {
					return {};
				}
				return {
					[this.fieldMapping.noOfTimesVisited]: {
						[Op.lte]: upperLimit,
					},
				};
			},

			isRenewed: (isRenewed) => {
				if (isRenewed == "") {
					return {};
				}
				let isTrueOrFalse =
					String(isRenewed).toLowerCase() === "true"
						? true
						: String(isRenewed).toLowerCase() === "false"
						? false
						: null;

				return {
					[this.fieldMapping.isRenewed]: {
						[Op.eq]: isTrueOrFalse,
					},
				};
			},

			isExpired: (isExpired) => {
				if (isExpired == "") {
					return {};
				}
				let isTrueOrFalse =
					String(isExpired).toLowerCase() === "true"
						? true
						: String(isExpired).toLowerCase() === "false"
						? false
						: null;

				return {
					[this.fieldMapping.isExpired]: {
						[Op.eq]: isTrueOrFalse,
					},
				};
			},
		});

		this.associations = Object.freeze({
			payment: "payment",
		});
	}
}
const urlConfig = new UrlConfig();
// deepFreeze(userConfig)

module.exports = urlConfig;
