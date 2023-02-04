import { Sequelize } from "sequelize";

const db = new Sequelize("latihan-jws", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
