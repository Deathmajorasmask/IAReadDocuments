// CONTROLLER & MODULE NOT USED

// .env file
require("dotenv").config();

// File reader
const fs = require("fs");

// PostgreSQL
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

async function fnLoadIdClassifyProductsArray() {
  const response = await pool.query("SELECT * FROM products ORDER BY id");

  let context = {
    status: 200,
    isRaw: true,
    body: response.rows,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return context;
}

async function fnCreateDocumentToDB(
  name,
  doc_group_id,
  doc_type_id,
  contract_id,
  url,
  isvalid,
  isreviewed,
  isactive,
  owner_user_id,
  owner_org_id,
  owner_office_id,
  expired_at
) {
  console.log(
    "SELECT * FROM passi_set_docs" +
      `(${name}, ${doc_group_id}, ${doc_type_id}, ${contract_id}, ${url}, ${isvalid}, ${isreviewed}, ${isactive}, ${owner_user_id}, ${owner_org_id}, ${owner_office_id}, ${expired_at})`
  );
  const response = await pool.query(
    "SELECT * FROM passi_set_docs" +
      "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      name,
      doc_group_id,
      doc_type_id,
      contract_id,
      url,
      isvalid,
      isreviewed,
      isactive,
      owner_user_id,
      owner_org_id,
      owner_office_id,
      expired_at,
    ]
  );
  console.log(response);
  let context = {
    status: 204,
    isRaw: true,
    body: {
      req: {
        id: response.rows[0].id,
        name,
        doc_group_id,
        doc_type_id,
        contract_id,
        url,
        isvalid,
        isreviewed,
        isactive,
        owner_user_id,
        owner_org_id,
        owner_office_id,
        expired_at,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
  return context;
}

async function fnSearchUserInfoByTuid(tuid) {
  if (tuid) {
    const response = await pool.query(
      "SELECT * FROM users WHERE tuid = $1 LIMIT 1",
      [tuid]
    );
    var context = {
      status: 200,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(context);
  } else {
    let context = {
      status: 204,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("tuid empty - undefined - null");
  }
  return context;
}

async function fnSearchOrgsInfoByToid(toid) {
  if (toid) {
    const response = await pool.query(
      "SELECT * FROM orgs WHERE toid = $1 LIMIT 1",
      [toid]
    );
    var context = {
      status: 200,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(context);
  } else {
    var context = {
      status: 204,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("toid empty - undefined - null");
  }
  return context;
}

async function fnSearchOrgsInfoById(id) {
  if (id) {
    const response = await pool.query(
      "SELECT * FROM orgs WHERE id = $1 LIMIT 1",
      [id]
    );
    let context = {
      status: 200,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(context);
  } else {
    let context = {
      status: 204,
      isRaw: true,
      body: response.rows[0],
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("id empty - undefined - null");
  }
  return context;
}

async function fnLoadIdClassifyDocsTypeArray() {
  const response = await pool.query("SELECT * FROM docs_type ORDER BY id");
  let context = {
    status: 200,
    isRaw: true,
    body: response.rows,
    headers: {
      "Content-Type": "application/json",
    },
  };
  //console.log(context);

  return context;
}

module.exports = {
  fnLoadIdClassifyProductsArray,
  fnSearchUserInfoByTuid,
  fnCreateDocumentToDB,
  fnSearchOrgsInfoByToid,
  fnSearchOrgsInfoById,
  fnLoadIdClassifyDocsTypeArray,
};
