import dotenv from 'dotenv';
dotenv.config();

const serveApp = require("./app");

import { PrismaClient } from './generated/prisma'
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Test Neon/Postgres connection
    await prisma.$connect();
    console.log("Connected to Neon PostgreSQL");

    // Start Express server
    serveApp.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database or start server", error);
    process.exit(1);
  }
}

main();