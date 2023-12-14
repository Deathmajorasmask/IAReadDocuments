const pg = require("pg");

/* const fs = require('fs');
const pool = new pg.Pool({
  host: '127.0.0.1',
  user: 'fgalvan',
  password: 'b4s3T3st',
  database: 'postgres',
  port: '3310',
  ssl : {
    ca: fs.readFileSync('/jumpbox.pem').toString()
}
});
 */

/* const pool = new pg.Client({
  host: "127.0.0.1",
  user: "fgalvan",
  password: "b4s3T3st",
  database: "postgres",
  port: "3310",
  ssl: true
}); */

const pool = new pg.Pool({
  /* host: "127.0.0.1",
  user: "postgres",
  password: "Aurq5x2D5p",
  database: "postgres",
  port: "3309", */
  host: "127.0.0.1",
  user: "fgalvan",
  password: "b4s3T3st",
  database: "postgres",
  port: "3310",
  /* host: "127.0.0.1",
  user: "paasidocs",
  password: "33IzOJWk4Sd9",
  database: "postgres",
  port: "3309", */
  /* host: "localhost",
  user: "postgres",
  password: "clocktown21",
  database: "testapi",
  port: "5432", */
});

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users limit 10");
  pool.end();
  console.log(response.rows);
  res.status(200).json(response.rows);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  console.log(response);
  res.status(200).json(response.rows);
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  console.log("Separados " + name + "  " + email);
  const response = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id]
  );
  console.log(response);
  res.json("Users updated successfully");
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  const response = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email]
  );
  console.log(response);
  res.json({
    message: "User added succesfully",
    body: {
      user: { name, email },
    },
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  console.log(response);
  res.json(`User ${id} deleted succesfully`);
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
};
