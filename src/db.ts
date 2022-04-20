import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("postgres://matt:306366@localhost:5432/sdc");

export default sequelize;