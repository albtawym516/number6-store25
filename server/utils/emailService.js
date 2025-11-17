const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 5px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
      <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 5px; border-bottom: 1px solid #ddd; text-align: right;">${(item.product.salePrice || item.product.price).toFixed(2)} ج.م</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"NUMBER 6 Store" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `طلب جديد #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>لقد تلقيت طلبًا جديدًا!</h2>
        <p><strong>رقم الطلب:</strong> ${order.id}</p>
        <p><strong>تاريخ الطلب:</strong> ${new Date(order.date).toLocaleDateString('ar-EG')}</p>
        
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">تفاصيل العميل</h3>
        <p><strong>الاسم:</strong> ${order.shippingInfo.fullName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${order.shippingInfo.email}</p>
        <p><strong>الهاتف:</strong> ${order.shippingInfo.phone}</p>
        <p><strong>العنوان:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city}</p>
        
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">المنتجات المطلوبة</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 5px; border-bottom: 2px solid #ddd; text-align: right;">المنتج</th>
              <th style="padding: 5px; border-bottom: 2px solid #ddd; text-align: center;">الكمية</th>
              <th style="padding: 5px; border-bottom: 2px solid #ddd; text-align: right;">السعر</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <h3 style="margin-top: 20px;">الإجمالي: ${order.total.toFixed(2)} ج.م</h3>
        <p>يمكنك عرض تفاصيل الطلب في لوحة التحكم.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };
