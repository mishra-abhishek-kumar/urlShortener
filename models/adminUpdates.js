"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class adminUpdates extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	adminUpdates.init(
		{
			freeUrlVisits: DataTypes.INTEGER,
			amtForExtraVisit: DataTypes.INTEGER,
			extraVisitsGranted: DataTypes.INTEGER,
			amtForExtraUrls: DataTypes.INTEGER,
			extraUrlGranted: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "adminUpdate",
			underscored: true,
			paranoid: true,
		}
	);
	return adminUpdates;
};
