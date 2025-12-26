const { PrismaClient } = require('@prisma/client');

// Create Prisma client with detailed logging enabled
// and avoid multiple instances in development (nodemon/hot reload)
const globalForPrisma = globalThis;
const prisma = globalForPrisma.__prismaClient || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.__prismaClient = prisma;

module.exports = prisma;
