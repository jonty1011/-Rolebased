import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Role } from './role.models';
import { UserRole } from './userRole.models';
import { AuditLog } from './auditLog.models';

export type  UserStatus = "active" | "inactive";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>  {
   declare userId?: string;
   declare userName?:string;
   declare email?:string;
   declare password?:string;
   declare status?:UserStatus;
   declare createdAt?:Date;
   declare updatedAt?:Date;

declare roles?: Role[];
     static associate(models: any) {
  
  // User <-> Role (many-to-many)
  User.belongsToMany(models.Role, {
    through: models.UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
  });

  // User has many AuditLogs
  User.hasMany(models.AuditLog, {
    foreignKey: "userId",
    as: "auditLogs",
  });
}

      // if want direct access to the mapping table entries
      // User.hasMany(UserRole,{
      //   foreignKey:"userId",
      //   as:"userRoles",
      // });



  static initModel(sequelize: Sequelize): typeof User {
  User.init(
    
    {
        userId:{
                type: DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                allowNull:false,
                primaryKey:true,
        },


        userName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },

        password:{
            type:DataTypes.STRING,
            allowNull:false
        },

        status:{
            type:DataTypes.ENUM("active","inactive"),
            allowNull:false,
            defaultValue:"active"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName:"Users",
        modelName:"User",
        timestamps:true,
        //paranoid:true,    
    }
  )
    return User
}
}