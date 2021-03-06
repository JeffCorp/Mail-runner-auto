const nodemailer = require("nodemailer");

exports.send_mail = (req, res, next) => {
  try {
    const {config, from, siteName, toUser, title, message} = req.body;
    const {host, port, appUsername, appPassword} = config;

    if(!config) throw Error("Input the configuration object as - config: {host, port, secure, appUsername, appPassword}");
    if(!from) throw Error("Input from whom the mail should read");
    if(!siteName) throw Error("Input the site Name");
    if(!toUser) throw Error("Input the user's email");
    if(!title) throw Error("Input the title of the mail");
    if(!message) throw Error("Input the message")

    // Configuration
    if (!appUsername) throw Error("Input an application Username")
    if (!appPassword) throw Error("Input an application Password")
    if (!host) throw Error("Input an host")
    if (!port) throw Error("Input an application port")



    mail(req)
      .then(() =>
        res.status(200).json({
          status: "sent",
          statusCode: 200,
          message:
            "Your mails has been sent successfully. We will get back to you soon",
          success: true,
        })
      )
      .catch((err) =>
        res.status(500).json({
          status: "Not sent",
          statusCode: 500,
          err: "Internal server error. Kindly go through the documentation",
          success: false,
        })
      );
  } catch (error) {
    return res.status(500).json({
      status: "Not sent",
      statusCode: 500,
      err: error,
      success: false,
    });
  }
};

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
    from: `${req.body.siteName} <${req.body.from}>`,
    to: `${req.body.toUser}`,
    subject: req.body.title,
    html: req.body.message,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
