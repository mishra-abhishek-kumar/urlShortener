"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Url, {
				foreignKey: "user_id",
			});

			User.hasMany(models.Payment, {
				foreignKey: "user_id",
			});

			User.hasMany(models.userSession, {
				foreignKey: "user_id",
			});

            User.hasMany(models.adminUpdate, {
				foreignKey: "user_id",
			});
		}
	}
	User.init(
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			isAdmin: DataTypes.BOOLEAN,
			dob: DataTypes.STRING,
			gender: DataTypes.STRING,
			noOfUrls: DataTypes.INTEGER,
			maxNoOfUrl: DataTypes.INTEGER,
			amtSpend: DataTypes.INTEGER,
			isBlocked: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "User",
			underscored: true,
			paranoid: true,
		}
	);
	return User;
};
