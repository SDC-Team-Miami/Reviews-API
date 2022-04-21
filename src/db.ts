import { Sequelize, DataType } from "sequelize-typescript";

const sequelize = new Sequelize(`${process.env.URI}`);

export const Review = sequelize.define(
  "review",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataType.INTEGER,
    },
    rating: {
      type: DataType.INTEGER,
    },
    date: {
      type: DataType.BIGINT,
    },
    summary: {
      type: DataType.TEXT,
    },
    body: {
      type: DataType.TEXT,
    },
    recommend: {
      type: DataType.BOOLEAN,
    },
    reported: {
      type: DataType.BOOLEAN,
    },
    reviewer_name: {
      type: DataType.TEXT,
    },
    reviewer_email: {
      type: DataType.TEXT,
    },
    response: {
      type: DataType.TEXT,
    },
    helpfulness: {
      type: DataType.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default sequelize;
