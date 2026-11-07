import nodemailer from 'nodemailer';
import crypto from 'crypto';

function escapeHtml(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function createSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
}

export async function processNotification(payload: any) {
  const notificationRecipient = process.env.NOTIFICATION_EMAIL || 'Contact@gearstation.in';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  let subject = '';
  let fromName = 'Gear Station';
  let replyTo = '';
  let text = '';
  let html = '';

  if (payload.type === 'contact') {
    const { name, email, phone, message } = payload.data || {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      throw new Error('Missing contact form fields');
    }

    subject = 'From Contact Form';
    fromName = 'Contact Form';
    replyTo = email.trim();

    text = [
      'From Contact Form',
      '',
      'CUSTOMER DETAILS',
      '────────────────────────',
      '',
      'Name:',
      name.trim(),
      '',
      'Email:',
      email.trim(),
      '',
      'Phone:',
      phone?.trim() || 'N/A',
      '',
      'MESSAGE',
      '────────────────────────',
      '',
      message.trim()
    ].join('\n');

    html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .header { background: #d31d1d; padding: 20px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; color: #fee2e2; font-size: 13px; }
    .content { padding: 28px 24px; }
    .section-title { font-size: 13px; font-weight: 700; color: #64748b; letter-spacing: 0.8px; text-transform: uppercase; margin: 24px 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .field-group { margin-bottom: 14px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 2px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; word-break: break-word; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #d31d1d; border-radius: 6px; padding: 14px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-top: 8px; }
    .footer { padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GEAR STATION</h1>
      <p>Contact Form Submission</p>
    </div>
    <div class="content">
      <div class="section-title">CUSTOMER DETAILS</div>
      <div class="field-group">
        <div class="field-label">Name</div>
        <div class="field-value">${escapeHtml(name)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(email)}" style="color: #d31d1d; text-decoration: none;">${escapeHtml(email)}</a></div>
      </div>
      <div class="field-group">
        <div class="field-label">Phone</div>
        <div class="field-value">${escapeHtml(phone || 'N/A')}</div>
      </div>

      <div class="section-title">MESSAGE</div>
      <div class="message-box">${escapeHtml(message)}</div>
    </div>
    <div class="footer">
      Received via Gear Station • ${timestamp}
    </div>
  </div>
</body>
</html>`;

  } else if (payload.type === 'order') {
    const { orderId, customer, items, total, paymentStatus, deliveryInfo } = payload.data || {};
    const customerName = customer?.fullName?.trim() || customer?.name?.trim() || '';
    const customerEmail = customer?.email?.trim() || '';
    const customerPhone = customer?.phone?.trim() || customer?.phoneNumber?.trim() || 'N/A';

    if (!customerName || !customerEmail || !items || items.length === 0) {
      throw new Error('Missing order fields');
    }

    const orderRef = orderId ? `#${orderId}` : '';
    subject = `Order ${orderRef} By ${customerName}`.trim();
    fromName = 'Gear Station';
    replyTo = customerEmail;

    const itemBlocksText = items.map((item: any, idx: number) => {
      const qty = item.quantity || 1;
      const days = item.totalDays ?? item.days ?? 1;
      const subtotalVal = item.totalPrice !== undefined && !isNaN(Number(item.totalPrice))
        ? Number(item.totalPrice)
        : (parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0) * qty * days;

      return [
        `Item ${idx + 1}: ${item.name}`,
        `Quantity: ${qty}`,
        `Rate: ${item.price || 'N/A'}`,
        `Pickup Date: ${item.startDate || 'N/A'}`,
        `Return Date: ${item.endDate || 'N/A'}`,
        `Rental Duration: ${days} day${days > 1 ? 's' : ''}`,
        `Subtotal: ₹${subtotalVal.toLocaleString('en-IN')}`,
        '────────────────────────'
      ].join('\n');
    }).join('\n\n');

    text = [
      `ORDER NOTIFICATION ${orderRef}`,
      `Order ID: ${orderId || 'N/A'}`,
      `Timestamp: ${timestamp}`,
      '',
      'CUSTOMER DETAILS',
      '────────────────────────',
      `Name: ${customerName}`,
      `Email: ${customerEmail}`,
      `Phone: ${customerPhone}`,
      customer.address ? `Address: ${customer.address}${customer.city ? ', ' + customer.city : ''}` : '',
      '',
      'RENTAL DETAILS',
      '────────────────────────',
      itemBlocksText,
      '',
      'ORDER SUMMARY',
      '────────────────────────',
      `Total Items: ${items.length}`,
      `Payment Status: ${paymentStatus || 'Pay on Pickup'}`,
      `Delivery / Pickup: ${deliveryInfo || 'Store Pickup / Direct Coordination'}`,
      `Total Estimated Cost: ₹${Number(total || 0).toLocaleString('en-IN')}`
    ].filter(Boolean).join('\n');

    const itemBlocksHtml = items.map((item: any, idx: number) => {
      const qty = item.quantity || 1;
      const days = item.totalDays ?? item.days ?? 1;
      const subtotalVal = item.totalPrice !== undefined && !isNaN(Number(item.totalPrice))
        ? Number(item.totalPrice)
        : (parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0) * qty * days;

      return `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div style="font-size: 15px; font-weight: 700; color: #0f172a;">
            ${idx + 1}. ${escapeHtml(item.name)}
          </div>
          <span style="background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">
            Qty: ${escapeHtml(qty)}
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${item.price ? `<tr>
            <td style="padding: 3px 0; color: #64748b; width: 110px;">Individual Rate:</td>
            <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">${escapeHtml(item.price)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 3px 0; color: #64748b; width: 110px;">Pickup Date:</td>
            <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">${escapeHtml(item.startDate || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;">Return Date:</td>
            <td style="padding: 3px 0; color: #1e293b; font-weight: 500;">${escapeHtml(item.endDate || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; color: #64748b;">Rental Duration:</td>
            <td style="padding: 3px 0; color: #1e293b;">${days} day${days > 1 ? 's' : ''}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0 0 0; color: #64748b; font-weight: 600;">Item Price:</td>
            <td style="padding: 4px 0 0 0; color: #d31d1d; font-weight: 700; font-size: 14px;">₹${subtotalVal.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
    `;
    }).join('');

    html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .header { background: #d31d1d; padding: 20px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; color: #fee2e2; font-size: 13px; }
    .content { padding: 28px 24px; }
    .meta-badge { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 16px; }
    .section-title { font-size: 13px; font-weight: 700; color: #64748b; letter-spacing: 0.8px; text-transform: uppercase; margin: 24px 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .field-group { margin-bottom: 14px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 2px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .summary-card { margin-top: 24px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .summary-total { border-top: 1px dashed #cbd5e1; margin-top: 8px; padding-top: 8px; font-size: 16px; font-weight: 700; color: #0f172a; }
    .footer { padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GEAR STATION</h1>
      <p>New Booking Request</p>
    </div>
    <div class="content">
      ${orderId ? `<div class="meta-badge">Order ID: <strong>#${escapeHtml(orderId)}</strong> &bull; ${escapeHtml(timestamp)}</div>` : ''}

      <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">
        Order By: <span style="color: #d31d1d;">${escapeHtml(customerName)}</span>
      </div>

      <div class="section-title" style="margin-top: 0;">CUSTOMER DETAILS</div>
      <div class="field-group">
        <div class="field-label">Name</div>
        <div class="field-value">${escapeHtml(customerName)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(customer.email)}" style="color: #d31d1d; text-decoration: none;">${escapeHtml(customer.email)}</a></div>
      </div>
      <div class="field-group">
        <div class="field-label">Phone</div>
        <div class="field-value">${escapeHtml(customer.phone || 'N/A')}</div>
      </div>

      <div class="section-title">RENTAL DETAILS</div>
      ${itemBlocksHtml}

      <div class="section-title">ORDER SUMMARY</div>
      <div class="summary-card">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Total Items:</td>
            <td style="padding: 4px 0; color: #0f172a; font-weight: 700; text-align: right;">${items.length}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Payment Status:</td>
            <td style="padding: 4px 0; color: #16a34a; font-weight: 700; text-align: right;">${escapeHtml(paymentStatus || 'Pay on Pickup')}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Delivery / Pickup:</td>
            <td style="padding: 4px 0; color: #0f172a; font-weight: 600; text-align: right;">${escapeHtml(deliveryInfo || 'Store Pickup / Direct Coordination')}</td>
          </tr>
          <tr style="border-top: 1px dashed #cbd5e1;">
            <td style="padding: 10px 0 2px 0; color: #0f172a; font-weight: 700; font-size: 16px;">Total Estimated Cost:</td>
            <td style="padding: 10px 0 2px 0; color: #d31d1d; font-weight: 800; font-size: 18px; text-align: right;">₹${Number(total).toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="footer">
      Received via Gear Station • ${timestamp}
    </div>
  </div>
</body>
</html>`;
  } else {
    throw new Error('Unknown notification type');
  }

  // Generate unique Message-ID
  const messageId = `<${Date.now()}.${crypto.randomBytes(6).toString('hex')}@gearstation.in>`;

  // 1. If SMTP is configured, attempt direct SMTP delivery
  const transporter = createSmtpTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `${fromName} <${process.env.SMTP_FROM || process.env.SMTP_USER || 'Contact@gearstation.in'}>`,
        to: notificationRecipient,
        replyTo: replyTo,
        subject: subject,
        text: text,
        html: html,
        headers: {
          'Message-ID': messageId,
          'X-Entity-Ref-ID': messageId
        }
      });
      console.log(`[SMTP SUCCESS] Sent business notification "${subject}" to ${notificationRecipient} (ID: ${info.messageId})`);

      // If customer confirmation applies and customer email exists, send customer confirmation email
      if (payload.type === 'order' && payload.data?.customer?.email) {
        try {
          const custEmail = payload.data.customer.email.trim();
          const custName = payload.data.customer.fullName || 'Customer';
          const orderIdStr = payload.data.orderId ? `#${payload.data.orderId}` : '';
          
          await transporter.sendMail({
            from: `"Gear Station" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'Contact@gearstation.in'}>`,
            to: custEmail,
            subject: `Booking Request Confirmed ${orderIdStr} - Gear Station`,
            text: [
              `Dear ${custName},`,
              '',
              `Thank you for choosing Gear Station! We have received your booking request ${orderIdStr}.`,
              '',
              `Total Estimated Cost: ₹${Number(payload.data.total).toLocaleString('en-IN')}`,
              `Payment Status: ${payload.data.paymentStatus || 'Pay on Pickup'}`,
              `Pickup / Delivery: ${payload.data.deliveryInfo || 'Store Pickup / Direct Coordination'}`,
              '',
              'Our Hyderabad team will contact you shortly to coordinate verification and pickup.',
              '',
              'Best regards,',
              'Gear Station Team',
              'Contact@gearstation.in | +91 72076 81067'
            ].join('\n')
          });
          console.log(`[CUSTOMER CONFIRMATION SUCCESS] Dispatched customer confirmation to ${custEmail}`);
        } catch (custErr: any) {
          console.warn('[CUSTOMER CONFIRMATION WARNING] Could not dispatch customer email:', custErr?.message || custErr);
        }
      }

      return { success: true, method: 'smtp', messageId: info.messageId };
    } catch (smtpErr: any) {
      console.warn('[SMTP WARNING] SMTP dispatch failed, falling back to FormSubmit:', smtpErr?.message || smtpErr);
    }
  }

  // 2. Fallback: Direct email delivery via FormSubmit HTTP API
  const token = process.env.FORMSUBMIT_TOKEN || notificationRecipient;
  const formSubmitUrl = `https://formsubmit.co/ajax/${token}`;

  try {
    const fsResponse = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/'
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: replyTo,
        _captcha: 'false',
        _template: 'box',
        _autoresponse: payload.type === 'order'
          ? `Thank you for choosing Gear Station! We have received your booking request for ${payload.data?.items?.length || 1} item(s). Our Hyderabad team will contact you shortly to confirm your gear reservation.`
          : 'Thank you for contacting Gear Station! We have received your message and our team will get back to you shortly.',
        Message_Content: text
      })
    });

    const fsData = await fsResponse.json();
    console.log(`[FORMSUBMIT SUCCESS] Dispatched "${subject}" to ${notificationRecipient}:`, fsData);
    return { success: true, method: 'formsubmit', data: fsData };
  } catch (fsErr: any) {
    console.error('[FORMSUBMIT ERROR] FormSubmit dispatch failed:', fsErr?.message || fsErr);
    return { success: false, error: fsErr?.message || 'Email delivery failed' };
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await processNotification(req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Serverless notification error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal error' });
  }
}
