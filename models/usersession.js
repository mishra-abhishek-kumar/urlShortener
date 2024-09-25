"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class userSession extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	userSession.init(
		{
			loginTime: DataTypes.DATE,
			logoutTime: DataTypes.DATE,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "userSession",
			underscored: true,
			paranoid: true,
		}
	);
	return userSession;
};
