import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  out: "./server/migrations",
  dialect: "postgresql",
  schema: "./server/schema.ts",

  dbCredentials: {
    url: process.env.SQL_URL as string,
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: []
    }
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
