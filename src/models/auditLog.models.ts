import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from './user.models';

export class AuditLog extends Model<InferAttributes<AuditLog>,InferCreationAttributes<AuditLog>>{
    declare auditId?: string;
    declare action?:string;
    declare entity?:string;
    declare entityId?:string;
    declare userId?:string;
    declare createdAt?:Date;
    declare updatedAt?:Date;

    static associate(models:any){
         AuditLog.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
    }

    static initModel(sequelize:Sequelize):typeof AuditLog{
        AuditLog.init(
            {
                auditId:{
                    type:DataTypes.UUID,
                    defaultValue:DataTypes.UUIDV4,
                    primaryKey:true
                },

                action:{
                    type:DataTypes.STRING,
                    allowNull:false
                },
                
                entity:{
                    type:DataTypes.STRING,
                    allowNull:false
                },

                entityId:{
                    type:DataTypes.UUID,
                    allowNull:false,
                },

                userId:{
                    type:DataTypes.UUID,
                    allowNull:false,
                },

                createdAt:{
                    type:DataTypes.DATE,
                    allowNull:false,
                    defaultValue:DataTypes.NOW
                },
                updatedAt:{
                    type:DataTypes.DATE,
                    allowNull:false,
                    defaultValue:DataTypes.NOW
                },
            },
            {
                sequelize,
                tableName:"auditlog",
                modelName:"AuditLog",
            }
        )
        return AuditLog
    }
}
