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

  const htmlContent = `
    <h2>New Enquiry Received!</h2>
    <p>A new customer enquiry has been submitted on the website.</p>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr><th align="left" width="30%">Name</th><td>${params.name || "N/A"}</td></tr>
      <tr><th align="left">Phone</th><td>${params.phone || "N/A"}</td></tr>
      <tr><th align="left">Email</th><td>${params.email || "N/A"}</td></tr>
      <tr><th align="left">City</th><td>${params.city || "N/A"}</td></tr>
      <tr><th align="left">Property Type</th><td>${params.property_type || "N/A"}</td></tr>
      <tr><th align="left">Source</th><td>${params.source || "N/A"}</td></tr>
      <tr><th align="left">Message</th><td>${params.message || "N/A"}</td></tr>
    </table>
    <br/>
    <p>Please check the admin dashboard for more details (ID: ${params.id}).</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Bed Bug System" <${process.env.EMAIL_SENDER}>`,
      to: receiver,
      subject: `🚨 New Enquiry from ${params.name} - ${params.phone}`,
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourwebsite.com";
  const liveLink = `${appUrl}/${params.slug}`;

  const htmlContent = `
    <h2>A New Blog was Published! 🎉</h2>
    <p>An article has successfully transitioned to <strong>Published</strong> status.</p>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr><th align="left" width="30%">Title</th><td>${params.title}</td></tr>
      <tr><th align="left">Topic</th><td>${params.topic}</td></tr>
      <tr><th align="left">Slug</th><td>/${params.slug}</td></tr>
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
