import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import process from "process";
import { Dialect } from "sequelize/types";

//importing User Model in index.ts
import { User } from "./user.models";
import { Role } from "./role.models";
import {UserRole} from "./userRole.models";
import { AuditLog } from "./auditLog.models";

import DBconfig from "../config/config";
// require('ts-node/register');

import { SequelizeOptions } from "sequelize-typescript";
// const dt = require('../config/config.js')

// const con = require('../config/config.js')
const basename = path.basename(__filename);
const env: "development" | "test" | "production" = (process.env.NODE_ENV ||
  "development") as "development" | "test" | "production";

// const env = process.env.NODE_ENV || 'development';
const config = DBconfig[env] as SequelizeOptions;

const db: any = {};

const sequelize = new Sequelize({
  ...config,
  dialect: config.dialect as Dialect,
});

// declaring a model 
db.User = User.initModel(sequelize);
db.Role = Role.initModel(sequelize);
db.UserRole = UserRole.initModel(sequelize);
db.AuditLog = AuditLog.initModel(sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {

    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
