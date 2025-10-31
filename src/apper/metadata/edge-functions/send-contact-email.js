import apper from "https://cdn.apper.io/actions/apper-actions.js";
import { Resend } from "npm:resend";

apper.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed. Use POST request."
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All fields are required (name, email, subject, message)"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email address format"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get Resend API key
    const resendApiKey = await apper.getSecret("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service configuration error. Please contact administrator."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send email to support team
    const supportEmail = await resend.emails.send({
      from: "BillFlow Contact <noreply@billflow.com>",
      to: "support@billflow.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Form Submission</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    if (supportEmail.error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send notification to support team"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: "BillFlow Support <noreply@billflow.com>",
      to: email,
      subject: "We received your message - BillFlow Support",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Thank You for Contacting BillFlow</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and our support team will get back to you within 24 hours.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>If you have any urgent questions, feel free to call us at <strong>1-800-BILLFLOW</strong>.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>BillFlow Support Team</strong></p>
        </div>
      `
    });

    if (userEmail.error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send confirmation email to user"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred. Please try again later."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});