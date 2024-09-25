"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Payment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Payment.init(
		{
			paymentFor: DataTypes.STRING,
			amountPaid: DataTypes.INTEGER,
			paymentTime: DataTypes.DATE,
			userId: DataTypes.INTEGER,
			urlId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Payment",
			underscored: true,
			paranoid: true,
		}
	);
	return Payment;
};
