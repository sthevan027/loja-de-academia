import { neon } from "@neondatabase/serverless"

// Cria uma instância do cliente SQL
const sql = neon(process.env.DATABASE_URL!)

export default sql
