// Prisma configuration file
import { defineConfig } from "prisma/config";

// Load dotenv only if available (for local development)
try {
  require("dotenv/config");
} catch {
  // dotenv not needed in production (Vercel injects env vars)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
