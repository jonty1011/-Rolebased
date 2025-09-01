import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize")
  ) {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // await queryInterface.addColumn("Users", "isVerfied", {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // });

    // await queryInterface.addColumn("Users", "OTP", {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // });

    // await queryInterface.addColumn("Users", "deletedAt", {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
  },

  async down(
    queryInterface: QueryInterface,
    Sequelize: typeof import("sequelize")
  ) {
    await queryInterface.dropTable("Users");
  },
};
