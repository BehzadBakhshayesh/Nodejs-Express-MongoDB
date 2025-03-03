const nodemailer = require('nodemailer')

const sendEmail = async (optios) => {

    const transporter = nodemailer.createTransport({
        host: proccess.env.EMAIL_HOST,
        port: proccess.env.EMAIL_PORT,
        auth: {
            user: proccess.env.EMAIL_USERNAME,
            pass: proccess.env.EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: "Behzad <behzad@gmail.com>",
        to: optios.email,
        subject: optios.subject,
        text: optios.message,
        // html:
    }

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail