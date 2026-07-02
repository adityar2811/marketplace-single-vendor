// backend/src/prisma.js
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// 1. Buat koneksi pool native PostgreSQL menggunakan pg driver
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Masukkan pool ke dalam Driver Adapter Prisma v7
const adapter = new PrismaPg(pool);

// 3. Masukkan adapter ke constructor PrismaClient (Standard Baru Prisma v7)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
