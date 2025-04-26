import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar os dados
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Configurar o transporte de email
    // Nota: Em produção, você deve usar um serviço de email real
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "user@example.com",
        pass: process.env.EMAIL_PASSWORD || "password",
      },
    })

    // Configurar o email
    const mailOptions = {
      from: `"${data.name}" <${data.email}>`,
      to: "admin@powerfit.com",
      subject: `Contato via Site: ${data.subject}`,
      text: `
        Nome: ${data.name}
        Email: ${data.email}
        Assunto: ${data.subject}
        
        Mensagem:
        ${data.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Assunto:</strong> ${data.subject}</p>
          <div style="margin-top: 20px;">
            <p><strong>Mensagem:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message.replace(
              /\n/g,
              "<br />",
            )}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Esta mensagem foi enviada através do formulário de contato do site Ritmoalpha.</p>
          </div>
        </div>
      `,
    }

    // Enviar o email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
