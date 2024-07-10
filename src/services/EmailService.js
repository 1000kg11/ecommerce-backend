// const nodemailer = require('nodemailer')
// const dotenv = require('dotenv');
// dotenv.config()

// const sendEmailCreateOrder = async (email, orderItems) =>{
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true, // Use `true` for port 465, `false` for all other ports
//         auth: {
//           user: process.env.MAIL_ACCOUNT,
//           pass: process.env.MAIL_PASSWORD,
//         },
//       });
//       transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

//       let listItem =''
//       const attachImage = []
//       orderItems.forEach((order) =>{
//         listItem += `<div>
//         <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> có giá là: <b>${order.price} VND</b></div>
//         <div>anh san pham</div>
//         </div>`
//         attachImage.push({path: order.image})
//       })
//         // send mail with defined transport object
//         const info = await transporter.sendMail({
//           from: process.env.MAIL_ACCOUNT, // sender address
//           to: "ntan7012@gmail.com", // list of receivers
//           subject: "Bạn đã đặt hàng tại shop Laptrinhkhovl", // Subject line
//           text: "Hello world?", // plain text body
//           html: `<div><b>Bạn đã đặt hàng thành công tại shop Laptrinhkhovl</b></div> ${listItem}`, // html body
//           attachments: attachImage,
//         });
// }
// module.exports ={
//     sendEmailCreateOrder
// }

const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()

const sendEmailCreateOrder = async (email, orderItems) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      
      let listItem =''
      orderItems.forEach((order) =>{
        listItem += `<div>
        <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> có giá là: <b>${order.price} VND</b></div>
        <div><img src=${order.iamge} alt="sản phẩm"/></div>
        </div>`
      })
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: process.env.MAIL_ACCOUNT, // sender address
          to: email, // list of receivers
          subject: "Bạn đã đặt hàng tại shop Laptrinhkhovl", // Subject line
          text: "Hello world?", // plain text body
          html: `<div><b>Bạn đã đặt hàng thành công tại shop Laptrinhkhovl</b></div> ${listItem}`, // html body
        });
}
module.exports ={
    sendEmailCreateOrder
}