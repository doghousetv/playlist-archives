import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const urlObj = new URL(databaseUrl)
if (!urlObj.pathname || urlObj.pathname === "/") {
  console.error("⚠️  DATABASE_URL is missing database name. Current pathname:", urlObj.pathname)
  throw new Error("DATABASE_URL must include a database name (e.g., /playlist-archives)")
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
})

export { prisma }

