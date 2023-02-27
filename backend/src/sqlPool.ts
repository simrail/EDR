import {Pool} from "pg";

const connPool = new Pool({
    host: process.env["PG_HOST"],
    user: process.env["PG_USER"] ?? "postgres",
    password: process.env["PG_PWD"],
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

export default connPool;