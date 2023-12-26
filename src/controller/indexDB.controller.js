// .env file
require("dotenv").config();

// File reader
const fs = require("fs");

const pg = require("pg");

const pool = new pg.Pool({
  host: process.env.RESIO_HOST,
  user: process.env.RESIO_USER,
  password: process.env.RESIO_PASSWORD,
  database: process.env.RESIO_DATABASE,
  port: process.env.RESIO_PORT,
  ssl: {
    rejectUnauthorized: false, // Esto es para un entorno de desarrollo, para producción considera manejar certificados
  },
  /* ssl: {
    // Especifica la ruta al certificado raíz de RDS
    ca: fs.readFileSync('./us-west-2-bundle.pem').toString()
  } */
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
