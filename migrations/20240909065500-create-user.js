"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			first_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			last_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			is_admin: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
			dob: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			gender: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			noOfUrls: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			amt_spend: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			is_blocked: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Users");
	},
};
