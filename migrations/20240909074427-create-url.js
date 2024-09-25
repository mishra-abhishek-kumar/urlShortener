"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Urls", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			long_url: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			short_url: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			no_of_times_visited: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			is_renewed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			is_expired: {
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
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Urls");
	},
};
