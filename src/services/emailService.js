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
        from: '"Doctor 👻" <haverdjonathan@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Order Confirmation ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHtml(dataSend.language, dataSend)
        , // html body
    });
    console.log("email sent!", info);
}

let getBodyHtml = (language, dataSend) => {
    let result = ``;
    if(language === 'vi'){
        result = `
            <h3>Xin chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh Online trên DatBooking 🩺</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sỹ: ${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên là chính xác, bạn vui lòng xác nhận thông qua liên kết bên 
            dưới để hoàn tất thủ tục đặt lịch khám bệnh:
            </p>
            <div style="background-color: red; border-radius: 5px; padding: 5px 8px; display: inline-block;">
                <a style="text-decoration: none; color: white; font-size: 1.25rem;" href='${dataSend.redirectLink}' target="_blank">Click here</a>
            </div>
            
            <div>Xin chân thành cảm ơn 🤩</div>
        `;
    }
    else if(language === 'en'){
        result = `
            <h3>Dear ${dataSend.patientName}</h3>
            <p>You received this email because you scheduled a medical examination appointment 🩺</p>
            <p>Schedule information:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>If the above information is correct, please confirm the information via the link below to complete the procedure of 
            setting up a medical examination appointment:
            </p>
            <div style="background-color: red; border-radius: 5px; padding: 5px 8px; display: inline-block;">
                <a style="text-decoration: none; color: white; font-size: 1.25rem;" href='${dataSend.redirectLink}' target="_blank">Click here</a>
            </div>

            <div>Thank you 🤩</div>
        `;
    }
    return result;
}
module.exports = {
    sendEmail
}