import mysql from 'mysql2/promise';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(config);
  }
  return pool;
}

export async function query(sql: string, params: any[] = []) {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

export async function fetch(sql: string, params: any[] = []) {
  const results = await query(sql, params) as any[];
  return results.length > 0 ? results[0] : null;
}

export async function fetchAll(sql: string, params: any[] = []) {
  return await query(sql, params);
}

export async function execute(sql: string, params: any[] = []) {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, params) as any[];
    return result;
  } finally {
    connection.release();
  }
}

export async function getLastInsertId(sql: string, params: any[] = []) {
  const result = await execute(sql, params);
  return result.insertId;
}
