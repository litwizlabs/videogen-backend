import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user';
import sequelize from '../config/database';

class Analytics extends Model {
  public id!: number;
  public userId!: string;
  public endpoint!: string;
  public method!: string;
  public timestamp!: Date;
  public responseTime!: number;
  public userid!: number;
}

Analytics.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Analytics',
});

Analytics.belongsTo(User, { foreignKey: 'userid' });

export default Analytics;
