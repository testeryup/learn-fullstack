require('dotenv').config();
const nodemailer = require("nodemailer");



// async..await is not allowed in global scope, must use a wrapper
// async function main() {
//     // send mail with defined transport object


//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);
let sendEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            // user: "maddison53@ethereal.email",
            // pass: "jn7jnAPss4f63QBp6D",
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: '"DANCHOI 👻" <haverdjonathan@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `
            <h3>Xin chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh Online trên DatBooking 🩺</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sỹ: ${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên là chính xác, bạn vui lòng xác nhận thông qua liên kết bên 
            dưới để hoàn tất thủ tục đặt lịch khám bệnh:
            </p>
            <div style="background-color: red; border-radius: 5px; color: white;">
                <a href='${dataSend.redirectLink}' target="_blank">Click here</a>
            </div>
            
            <div>Xin chân thành cảm ơn 🤩</div>
        `, // html body
    });
    console.log("email sent!", info);
}
module.exports = {
    sendEmail
}