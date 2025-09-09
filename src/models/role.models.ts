import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from './user.models';
import { UserRole } from './userRole.models';

export class Role extends Model<InferAttributes<Role>,InferCreationAttributes<Role>>{
 declare roleId?: string;
 declare roleName?: string;
 declare createdAt?: Date;
 declare updatedAt?: Date;

 static associate(models:any){

      Role.belongsToMany(models.User, {
    through: models.UserRole, 
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
  });
     
 }

 static initModel(sequelize:Sequelize):typeof Role{
    Role.init(
        {
            roleId:{
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            allowNull:false,
            primaryKey:true,
            },
            roleName:{
                type:DataTypes.STRING,
                allowNull:false
            },
            createdAt:{
               type: DataTypes.DATE,
               defaultValue:DataTypes.NOW,
            },
            updatedAt:{
               type: DataTypes.DATE,
               defaultValue:DataTypes.NOW
            },
            
        },
        {
            sequelize,
            tableName:"Roles",
            modelName:"Role",
            timestamps:true,
        }
    )
    return Role
 }
}