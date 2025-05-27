const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ email, subject, html }) => {
  const mailOptions = {
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
};

module.exports = sendEmail;