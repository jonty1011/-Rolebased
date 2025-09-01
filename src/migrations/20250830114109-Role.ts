"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize")
  ) {
    await queryInterface.createTable("Roles", {
      roleId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
       defaultValue: Sequelize.literal("(UUID())"), 
      },
      roleName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize")
  ) {
    await queryInterface.dropTable("Roles");
  },
};
