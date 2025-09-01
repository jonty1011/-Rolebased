import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from './user.models';
import { Role } from './role.models';

export class UserRole extends Model<InferAttributes<UserRole>,InferCreationAttributes<UserRole>>{
    declare userId?:string;
    declare roleId?:string;
    declare createdAt?:Date;
    declare updateAt?:Date;

   static associate(models:any){
       UserRole.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  UserRole.belongsTo(models.Role, {
    foreignKey: "roleId",
    as: "role",
  });


       
 }

 static initModel(sequelize:Sequelize): typeof UserRole{
        UserRole.init(
        {
          
            userId:{
                type:DataTypes.UUID,
                allowNull:false,
             
            },

            roleId:{
                type:DataTypes.UUID,
                allowNull:false
            }
        },
        {
            sequelize,
            tableName:"userRoles",
            modelName:"UserRole",
            timestamps:true,
        }
        )
        return UserRole
 }
}