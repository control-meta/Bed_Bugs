import nodemailer from "nodemailer";

interface EnquiryNotificationParams {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  property_type?: string | null;
  message?: string | null;
  source?: string | null;
}

interface BlogPublishedNotificationParams {
  id: string;
  slug: string;
  title: string;
  topic: string;
  score?: number;
  tokenUse?: number;
}

/**
 * Safe initializer for the transporter.
 * If env vars are missing, it returns null instead of crashing.
 */
function getTransporter() {
  const sender = process.env.EMAIL_SENDER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!sender || !pass) {
    console.warn("[Email Service] Missing EMAIL_SENDER or EMAIL_APP_PASSWORD. Email notifications are disabled.");
    return null;
  }

  // Configured for Gmail by default, but can be adapted for any SMTP
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender,
      pass: pass,
    },
  });
}

/**
 * Sends an email notification when a new enquiry is received.
 */
export async function sendNewEnquiryEmail(params: EnquiryNotificationParams) {
  const receiver = process.env.EMAIL_RECEIVER;
  if (!receiver) {
    console.warn("[Email Service] Missing EMAIL_RECEIVER. Cannot send enquiry email.");
    return;
  }

  const transporter = getTransporter();
  if (!transporter) return;

  const cleanPhone = (params.phone || "").replace(/\D/g, "");
  const whatsappPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappMsg = encodeURIComponent(
    `Hi ${params.name || "there"}, thank you for contacting Bed Bug Treatment. How can we help you today?`
  );

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1f8055 0%, #17523a 100%); padding: 22px 24px; color: #ffffff;">
        <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">🚨 New Customer Lead!</h2>
        <p style="margin: 0; font-size: 13px; color: #dcf3e6;">A new customer requested a callback on the website.</p>
      </div>

      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #4b5563; width: 35%;">Customer Name</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: 700; color: #111827;">${params.name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #4b5563;">Phone Number</td>
            <td style="padding: 12px 0; font-size: 18px; font-weight: 800; color: #1f8055;">
              <a href="tel:${cleanPhone}" style="color: #1f8055; text-decoration: none;">${params.phone}</a>
            </td>
          </tr>
        </table>

        <div style="margin-top: 10px; padding-top: 15px; border-top: 1px solid #f3f4f6;">
          <a href="tel:${cleanPhone}" style="display: inline-block; background-color: #1f8055; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; margin-right: 10px; margin-bottom: 8px;">
            📞 Call Customer
          </a>
          <a href="https://wa.me/${whatsappPhone}?text=${whatsappMsg}" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 8px;">
            💬 Open WhatsApp
          </a>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 12px 24px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #6b7280;">
        Lead ID: ${params.id} • Submitted via website
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Bed Bug System" <${process.env.EMAIL_SENDER}>`,
      to: receiver,
      subject: `🚨 New Lead: ${params.name} - ${params.phone}`,
      html: htmlContent,
    });
    console.log(`[Email Service] Enquiry notification sent for ${params.name}`);
  } catch (error) {
    console.error("[Email Service] Failed to send enquiry email:", error);
  }
}

/**
 * Sends an email notification when a new blog is published.
 */
export async function sendBlogPublishedEmail(params: BlogPublishedNotificationParams) {
  const receiver = process.env.EMAIL_RECEIVER;
  if (!receiver) {
    console.warn("[Email Service] Missing EMAIL_RECEIVER. Cannot send blog email.");
    return;
  }

  const transporter = getTransporter();
  if (!transporter) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bedbugstreatment.co.in";
  const liveLink = `${appUrl}/${params.slug}`;

  const htmlContent = `
    <h2>A New Blog was Published! 🎉</h2>
    <p>An article has successfully transitioned to <strong>Published</strong> status.</p>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr><th align="left" width="30%">Title</th><td>${params.title}</td></tr>
      <tr><th align="left">Topic</th><td>${params.topic}</td></tr>
      <tr><th align="left">Slug</th><td>/${params.slug}</td></tr>
      <tr><th align="left">Tokens Used</th><td>${params.tokenUse ? params.tokenUse.toLocaleString() : 'N/A'}</td></tr>
      <tr><th align="left">Live Link</th><td><a href="${liveLink}">${liveLink}</a></td></tr>
    </table>
    <br/>
    <p>You can view and edit the live post from the admin dashboard.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Bed Bug System" <${process.env.EMAIL_SENDER}>`,
      to: receiver,
      subject: `✅ Blog Published: ${params.title}`,
      html: htmlContent,
    });
    console.log(`[Email Service] Blog published notification sent for ${params.slug}`);
  } catch (error) {
    console.error("[Email Service] Failed to send blog published email:", error);
  }
}

/**
 * Sends a test email to verify credentials.
 */
export async function sendTestEmail() {
  const receiver = process.env.EMAIL_RECEIVER;
  if (!receiver) {
    throw new Error("Missing EMAIL_RECEIVER environment variable.");
  }

  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("Email credentials (EMAIL_SENDER or EMAIL_APP_PASSWORD) are missing.");
  }

  const htmlContent = `
    <h2>Test Email Successful! 🎉</h2>
    <p>If you are seeing this, your email configuration in <strong>.env.local</strong> is working perfectly.</p>
    <p>You will now receive notifications for new enquiries and published blogs.</p>
  `;

  await transporter.sendMail({
    from: `"Bed Bug System" <${process.env.EMAIL_SENDER}>`,
    to: receiver,
    subject: `🟢 System Test Email`,
    html: htmlContent,
  });
  console.log(`[Email Service] Test email sent successfully.`);
}
