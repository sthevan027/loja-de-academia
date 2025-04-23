import { neon } from "@neondatabase/serverless"

// Criar uma conexão SQL com o banco de dados Neon
export const sql = neon(process.env.DATABASE_URL!)

// Função para executar consultas SQL usando a sintaxe de template literal
export async function query(strings: TemplateStringsArray, ...values: any[]) {
  try {
    const start = Date.now()
    const result = await sql(strings, ...values)
    const duration = Date.now() - start

    // Log apenas para consultas lentas (mais de 100ms)
    if (duration > 100) {
      console.log("Consulta lenta:", { duration, rowCount: result.length })
    }

    return { rows: result, rowCount: result.length }
  } catch (error) {
    console.error("Erro na consulta:", error)
    throw error
  }
}
