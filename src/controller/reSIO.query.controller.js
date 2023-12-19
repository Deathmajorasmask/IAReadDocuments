// .env file
require("dotenv").config();

const pg = require("pg");

const pool = new pg.Pool({
  host: process.env.RESIO_HOST,
  user: process.env.RESIO_USER,
  password: process.env.RESIO_PASSWORD,
  database: process.env.RESIO_DATABASE,
  port: process.env.RESIO_PORT,
});

async function fnSearchUserInfoByTuid(tuid) {
  if (tuid) {
    const response = await pool.query(
        "SELECT * FROM users WHERE uid = $1 LIMIT 10",
        [tuid]
      );
      var context = {
        status: 200,
        isRaw: true,
        body: response.rows[0],
        headers:{
          'Content-Type': 'application/json'
        }
      }
      console.log(context);
  } else {
    var context = {
      status: 204,
      isRaw: true,
      body: response.rows[0],
      headers:{
        'Content-Type': 'application/json'
      }
    }
    console.log("tuid empty - undefined - null");
  }
  return context;
}

module.exports = {
  fnSearchUserInfoByTuid,
};
