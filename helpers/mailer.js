const nodemailer = require("nodemailer");

// TODO
const sendMail = (to, type, from = "support@lowes.com") => {
  let transporter = nodemailer.createTransport({
    debug: true,
    // sendmail: true,
    // newline: "unix",
    // path: "/usr/sbin/sendmail",
    // port: 25,
    // host: "localhost",
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  let { subject, message, html } = getTemplate(type);

  transporter.sendMail(
    {
      from,
      to,
      subject,
      text: message,
      html: html,
    },
    (err, info) => {
      if (err) {
        console.log("from error in nodemailder");
        console.log(err);
      }
      console.log(info.envelope);
      console.log(info.messageId);
    }
  );
};

const getTemplate = (type) => {
  if (type == "register") {
    return {
      subject: "Login Details",
      message: "please find your login details",
      html: 'Hi, Welcome to Lowes. <br /><br /> Please find your credentials below: <br /> Username: "hello@lowes.com" <br /> Temporary Password: "Pass"',
    };
  } else if (type == "login") {
    return {
      subject: "Login Details",
      message: "please find your login activity details",
      html: "Hi, Welcome to Lowes. <br /><br /> We found that you have just logged in. If not, please contact the administrator immediately",
    };
  }
};

module.exports = { sendMail };
