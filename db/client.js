const { Pool } = require("pg");

// hardcoded values inside the new Pool construtor, these will be exposed
// const pool = new Pool({
//   user: "myusername",
//   host: "dbHostName",
//   database: "myDB",
//   password: "mYpassword",
//   port: 5432,
// });

//better way: with env vars
//pools will use environment variables for connection information, but they must follow the naming convention (see .env.SAMPLE)
const pool = new Pool();

module.exports = pool;
