import { NextResponse } from 'next/server'
import { sql } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const result = await sql`
      SELECT terms FROM footer_terms 
      ORDER BY id DESC 
      LIMIT 1
    `
    return NextResponse.json({ terms: result.rows[0]?.terms || 'Todos os direitos reservados.' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar termos' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { terms } = await request.json()
    
    if (!terms || terms.length > 500) {
      return NextResponse.json(
        { error: 'Termos inválidos ou muito longos (máximo 500 caracteres)' },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO footer_terms (terms)
      VALUES (${terms})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar termos' }, { status: 500 })
  }
} 