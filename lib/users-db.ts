import { query } from "./db"
import bcrypt from "bcryptjs"

export type User = {
  id: number
  name: string
  email: string
  is_admin: boolean
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const sql = `SELECT * FROM users WHERE email = $1`
    const result = await query(sql, [email])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as User
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
    return null
  }
}

export async function createUser(name: string, email: string, password: string, isAdmin = false): Promise<User | null> {
  try {
    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return null
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO users (name, email, password, is_admin)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, is_admin
    `

    const result = await query(sql, [name, email, hashedPassword, isAdmin])

    return result.rows[0] as User
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return null
  }
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  try {
    const sql = `SELECT * FROM users WHERE email = $1`
    const result = await query(sql, [email])

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return null
    }

    // Não retornar a senha
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword as User
  } catch (error) {
    console.error("Erro ao verificar credenciais do usuário:", error)
    return null
  }
}
