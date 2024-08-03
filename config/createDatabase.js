// const { Sequelize } = require('sequelize');
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const dbName = process.env.DB_NAME;
// const dbUser = process.env.DB_USER;
// const dbPassword = process.env.DB_PASSWORD;
// const dbHost = process.env.DB_HOST;

// async function createDatabase() {
//   try {
//     const connection = await mysql.createConnection({
//       host: dbHost,
//       user: dbUser,
//       password: dbPassword,
//     });

//     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
//     console.log(`Database ${dbName} created or already exists`);
//     await connection.end();
//   } catch (error) {
//     console.error('Error creating database:', error);
//     process.exit(1);
//   }
// }

// createDatabase().then(() => {
//   // Once the database is created, you can initialize Sequelize
//   const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//     host: dbHost,
//     dialect: 'mysql',
//   });

//   // Synchronize models or run migrations
//   sequelize.sync().then(() => {
//     console.log('Database synchronized');
//     process.exit(0);
//   }).catch(err => {
//     console.error('Error synchronizing database:', err);
//     process.exit(1);
//   });
// });


const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database ${dbName} created or already exists`);
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase().then(() => {
  // Once the database is created, you can initialize Sequelize
  const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
  });

  // Synchronize models or run migrations
  sequelize.sync().then(() => {
    console.log('Database synchronized');

    // Run migrations
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing migrations: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`Migration stderr: ${stderr}`);
      }
      console.log(`Migration stdout: ${stdout}`);
      process.exit(0);
    });
  }).catch(err => {
    console.error('Error synchronizing database:', err);
    process.exit(1);
  });
});
