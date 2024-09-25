const db = require("../../models");
const { validateUuid } = require("../utils/uuid");
const { Op, Sequelize } = require("sequelize");

class AdminUpdateConfig {
	constructor() {
		this.fieldMapping = Object.freeze({
			id: "id",
			freeUrlVisits: "freeUrlVisits",
			amtForExtraVisit: "amtForExtraVisit",
			extraVisitsGranted: "extraVisitsGranted",
			amtForExtraUrls: "amtForExtraUrls",
			extraUrlGranted: "extraUrlGranted",
			userId: "userId",
		});
		this.model = db.adminUpdate;
		this.modelName = db.adminUpdate.name;
		this.tableName = db.adminUpdate.tableName;

		this.columnMapping = Object.freeze({
			id: this.model.rawAttributes[this.fieldMapping.id].field,
			freeUrlVisits:
				this.model.rawAttributes[this.fieldMapping.freeUrlVisits].field,
			amtForExtraVisit:
				this.model.rawAttributes[this.fieldMapping.amtForExtraVisit].field,
			extraVisitsGranted:
				this.model.rawAttributes[this.fieldMapping.extraVisitsGranted].field,
			amtForExtraUrls:
				this.model.rawAttributes[this.fieldMapping.amtForExtraUrls].field,
			extraUrlGranted:
				this.model.rawAttributes[this.fieldMapping.extraUrlGranted].field,
			userId: this.model.rawAttributes[this.fieldMapping.userId].field,
		});
	}
}
const adminUpdateConfig = new AdminUpdateConfig();
// deepFreeze(userConfig)

module.exports = adminUpdateConfig;
