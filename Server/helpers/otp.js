const nodemailer = require('nodemailer');
const axios = require('axios');
const { getEmailConfig, getWhatsAppConfig } = require('../firebase/dbConfig');

class OTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendEmailOTP(email, otp, companyId) {
    const emailConfig = getEmailConfig(companyId);
    const transporter = nodemailer.createTransport(emailConfig);

    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Verification OTP',
      text: `Your OTP is: ${otp}`,
      html: `<h1>Your OTP is: ${otp}</h1>`
    });
  }

  static async sendWhatsAppOTP(phone, otp, companyId) {
    const whatsappConfig = getWhatsAppConfig(companyId);
    
    try {
      await axios.post('https://api.wappie.in/v2/whatsapp/messages/sendDirectly', {
        from: whatsappConfig.fromNumber,
        to: phone,
        type: "template",
        template: {
          name: whatsappConfig.templateName,
          language: {
            code: "en",
            policy: "deterministic"
          },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: otp }]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: otp }]
            }
          ]
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': whatsappConfig.apiKey
        }
      });
    } catch (error) {
      throw new Error('Failed to send WhatsApp OTP: ' + error.message);
    }
  }
}

module.exports = OTPService; 