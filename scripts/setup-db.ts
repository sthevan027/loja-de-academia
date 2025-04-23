import { sql } from '@/lib/db'
import fs from 'fs'
import path from 'path'

async function setupDatabase() {
  try {
    // Ler o arquivo SQL
    const sqlFile = path.join(process.cwd(), 'sql', 'footer_terms.sql')
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')

    // Executar o script SQL
    await sql(sqlContent)
    console.log('✅ Tabela footer_terms criada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error)
    process.exit(1)
  }
}

setupDatabase() 