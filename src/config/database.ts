import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = 'database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // set to console.log to see the raw SQL queries
});

export default sequelize;
