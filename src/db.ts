import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(`${process.env.URI}`);

export default sequelize;
