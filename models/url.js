"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Url extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Url.hasMany(models.Payment, {
				foreignKey: "url_id",
			});
		}
	}
	Url.init(
		{
			longUrl: DataTypes.TEXT,
			shortUrl: DataTypes.STRING,
			noOfTimesVisited: DataTypes.INTEGER,
			maxNoOfVisit: DataTypes.INTEGER,
			isRenewed: DataTypes.BOOLEAN,
			isExpired: DataTypes.BOOLEAN,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Url",
			underscored: true,
			paranoid: true,
		}
	);
	return Url;
};
