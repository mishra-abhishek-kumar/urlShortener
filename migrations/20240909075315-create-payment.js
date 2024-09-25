"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Payments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			payment_for: {
                allowNull: false,
				type: Sequelize.STRING,
			},
			amount_paid: {
                allowNull: false,
				type: Sequelize.STRING,
			},
			payment_time: {
                allowNull: false,
				type: Sequelize.DATE,
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
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "Users",
					},
				},
				key: "id",
			},
			url_id: {
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: "Urls",
					},
				},
				key: "id",
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Payments");
	},
};
