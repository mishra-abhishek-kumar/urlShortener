"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("admin_updates", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			free_url_visits: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			amt_for_extra_visit: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			extra_visits_granted: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			amt_for_extra_urls: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			extra_url_granted: {
				allowNull: true,
				type: Sequelize.INTEGER,
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
						tableName: "users",
					},
				},
				key: "id",
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("admin_updates");
	},
};
