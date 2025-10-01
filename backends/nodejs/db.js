// Centraliza la conexión a la base de datos con MySQL2 y pool
// src/db.js
// Uso mysql2 para poder poolear
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bdbackfront",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
