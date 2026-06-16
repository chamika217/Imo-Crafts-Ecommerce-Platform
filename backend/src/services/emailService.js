import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLowStockAlert = async ({ products, adminEmail }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const productRows = products
    .map(p => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #F3F4F6;">${p.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #F3F4F6;color:${p.stockQty === 0 ? '#DC2626' : '#D97706'};font-weight:600;">
          ${p.stockQty === 0 ? 'OUT OF STOCK' : p.stockQty + ' remaining'}
        </td>
        <td style="padding:10px 16px;border-bottom:1px solid #F3F4F6;color:#6B7280;">${p.status}</td>
      </tr>
    `)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#8B4513,#A0522D);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">⚠️ Low Stock Alert</h1>
        <p style="color:#FFD9B8;margin:8px 0 0;">Imo Crafts Inventory Warning</p>
      </div>
      <div style="background:white;padding:32px;border:1px solid #F3F4F6;border-top:none;">
        <p style="color:#374151;margin-bottom:24px;">
          The following products are running low or out of stock. Please restock them soon.
        </p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
          <thead>
            <tr style="background:#FFF8F0;">
              <th style="padding:12px 16px;text-align:left;font-size:12px;color:#92400E;text-transform:uppercase;">Product</th>
              <th style="padding:12px 16px;text-align:left;font-size:12px;color:#92400E;text-transform:uppercase;">Stock</th>
              <th style="padding:12px 16px;text-align:left;font-size:12px;color:#92400E;text-transform:uppercase;">Status</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
        <div style="background:#FFF8F0;border:1px solid #FFE0B2;border-radius:12px;padding:16px;margin-top:24px;">
          <p style="color:#92400E;margin:0;font-size:14px;">
            🔗 Log in to your admin panel to update inventory levels.
          </p>
        </div>
      </div>
      <div style="background:#F9FAFB;padding:16px;border-radius:0 0 16px 16px;text-align:center;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;">Imo Crafts Admin System · Automated Alert</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Imo Crafts Admin" <${process.env.EMAIL_USER}>`,
    to: adminEmail || process.env.EMAIL_USER,
    subject: `⚠️ Low Stock Alert — ${products.length} product${products.length > 1 ? 's' : ''} need attention`,
    html,
  });
};
