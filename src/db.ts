import { Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.URI}`);

export default sequelize;
