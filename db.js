const uuid = require("uuid");
const pg = require("pg");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme-users-departments-pg"
);

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS departments;
        CREATE TABLE departments(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL);
        CREATE TABLE users(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL,
        department_id UUID REFERENCES departments(id),
        CHECK(char_length(name) > 0)
        );
    `;
  await client.query(SQL);
  createDepartment({ name: "bar" });
  createUser({ name: "foo" });
};

const createUser = async ({ name }) => {
  const SQL = `INSERT INTO users(name) values($1) returning *`;
  return (await client.query(SQL, [name])).rows[0];
};
const createDepartment = async ({ name }) => {
  const SQL = `INSERT INTO deparments(name) values($2) returning *`;
  return (await client.query(SQL, [name])).rows[0];
};
const findAllUsers = async () => {
  const SQL = `SELECT * FROM users`;
  return (await client.query(SQL)).rows;
};
const findAllDepartments = async () => {
  const SQL = `SELECT * FROM departments`;
  return (await client.query(SQL)).rows;
};

module.exports = {
  sync,
  findAllUsers,
  findAllDepartments
};
