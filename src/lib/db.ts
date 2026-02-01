import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
  // Solo permitimos SELECT según la regla Dificultad Obligatoria
  if (!text.trim().toUpperCase().startsWith('SELECT')) {
    throw new Error("Acceso denegado: Solo lectura.");
  }
  return pool.query(text, params);
};