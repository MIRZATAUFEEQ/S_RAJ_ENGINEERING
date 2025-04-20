import nodemailer from 'nodemailer'
export const forgotPasswordEmail = async (option) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
        const mailOption = {
            from: process.env.SPTP_EMAIL,
            to: option.email,
            subject: option.object,
            text: option.message
        }
        await transporter.sendMail(mailOption)
    } catch (error) {
        console.error(error)
    }
}