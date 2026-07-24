// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
import "dotenv/config";

const { Pool } = pg.default;

const connectionPool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

export default connectionPool;
