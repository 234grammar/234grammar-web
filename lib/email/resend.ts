import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@234grammar.com';

function baseTemplate(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <tr>
          <td style="background:#008751;padding:24px 40px">
            <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">234Grammar</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
              © 2026 234Grammar · Nigeria&apos;s grammar tool
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail({
  email,
  plan,
}: {
  email: string;
  plan: string;
}) {
  const isPro = plan === 'pro_trial' || plan === 'pro';
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#111827">Welcome to 234Grammar!</h1>
    <p style="margin:0 0 24px;color:#6b7280;font-size:16px">
      Thanks for signing up. ${isPro ? 'Your 7-day Pro trial starts the moment you verify your email.' : 'You&apos;re on the Free plan — 100 checks per month, no credit card needed.'}
    </p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px">
      Click the verification link in the email Supabase sent you to activate your account and start writing better Nigerian English.
    </p>
    ${isPro ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="margin:0;font-size:14px;color:#166534"><strong>Pro Trial:</strong> 7 days free, then &#8358;1,500/month. You won't be charged until your trial ends.</p>
    </div>` : ''}
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/editor" style="display:inline-block;background:#008751;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Open Editor →</a>
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Welcome to 234Grammar — verify your email',
    html: baseTemplate(body),
  });
}

export async function sendContactNotification(data: {
  category?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:20px;color:#111827">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#6b7280;width:120px">Category</td><td style="padding:8px 0;color:#111827">${data.category || '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Name</td><td style="padding:8px 0;color:#111827">${data.firstName || ''} ${data.lastName || ''}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0;color:#111827">${data.email}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0;color:#111827">${data.subject || '—'}</td></tr>
    </table>
    <div style="margin-top:16px;background:#f9fafb;border-radius:8px;padding:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.5px">Message</p>
      <p style="margin:0;color:#111827;font-size:14px;white-space:pre-wrap">${data.message}</p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: FROM,
    replyTo: data.email,
    subject: `Contact: ${data.subject || 'New message'} — ${data.email}`,
    html: baseTemplate(body),
  });
}

export async function sendPaymentSuccessEmail({ email }: { email: string }) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#111827">You're now on Pro! 🎉</h1>
    <p style="margin:0 0 24px;color:#6b7280;font-size:16px">
      Your payment was successful. Welcome to 234Grammar Pro — enjoy unlimited checks and all premium features.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:600">What you now have access to:</p>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#166534;line-height:1.8">
        <li>Unlimited grammar checks</li>
        <li>Document storage (100 docs)</li>
        <li>Advanced Pidgin support</li>
        <li>Export to PDF, DOCX, TXT</li>
      </ul>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/editor" style="display:inline-block;background:#008751;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Go to Editor →</a>
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Payment confirmed — You\'re on 234Grammar Pro!',
    html: baseTemplate(body),
  });
}
