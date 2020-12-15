const nodemailer = require("nodemailer");

exports.send_mail = (req, res, next) => {
    mail(req)
    .then(() => res.status(200).json({
        data : "Your inquiry has been sent successfully. We will get back to you soon"
    }))
    .catch((err) => res.status(500).json({
        err: "Internal server error"
    }))
}

async function mail(req) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: req.body.config.host,
        port: req.body.config.port,
        secure: req.body.config.secure, // true for 465, false for other ports
        auth: {
            user: req.body.config.appUsername, // fastmail user
            pass: req.body.config.appPassword, // fastmail App password
        },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${req.body.from ||
        `${req.body.siteName} <${req.body.from}>`}`,
      to: `${req.body.toDomain}, ${req.body.toUser}`,
      subject: req.body.title,
      html: req.body.message
    });
  
    
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }