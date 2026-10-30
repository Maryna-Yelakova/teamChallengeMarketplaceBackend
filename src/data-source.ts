import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

/** Explicit CLI data source. Application startup never runs migrations implicitly. */
export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [__dirname + "/entities/*{.js,.ts}"],
  migrations: [__dirname + "/migrations/*{.js,.ts}"],
  synchronize: false
});
