import "server-only";
import { Pool, QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://educore:educore123@localhost:5432/educore_lms";

declare global {
  // eslint-disable-next-line no-var
  var __postgres_pool__: Pool | undefined;
}

const pool =
  globalThis.__postgres_pool__ ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgres_pool__ = pool;
}

export const db = {
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<T[]> {
    const start = Date.now();
    try {
      const res = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === "development" && duration > 200) {
        console.warn(`[SLOW QUERY] ${duration}ms: ${text.slice(0, 80)}...`);
      }
      return res.rows;
    } catch (error) {
      console.error("[DATABASE ERROR]", error, { text, params });
      throw error;
    }
  },

  async queryOne<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows[0] || null;
  },

  async getClient() {
    return pool.connect();
  },
};
