const nodemailer = require('nodemailer')


console.log("Email User:", process.env.GOOGLE_USER);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASS,
  },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ozair Khan" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log('Message sent', info.messageId);
        console.log('URL: %s', nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.log('Error sending email', error)
    }
}

module.exports = sendEmail