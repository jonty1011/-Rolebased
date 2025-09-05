"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize")
  ) {
    await queryInterface.createTable("userRoles", {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model:"Users",
          key:"userId",
        },
        onUpdate:"CASCADE",
        onDelete:"CASCADE",
      },
       roleId:{
            type:Sequelize.UUID,
             allowNull:false,
             references:{
              model:"Roles",
              key:"roleId"
             },
             onUpdate:"CASCADE",
             onDelete:"CASCADE",
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
  async down(queryInterface:QueryInterface, Sequelize:typeof import("sequelize")) {
    await queryInterface.dropTable("userRoles");
  },
};
