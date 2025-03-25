import { json } from "@remix-run/node";
import nodemailer from "nodemailer";
import { google } from "googleapis";

// Retrieve credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI =
process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const action = async ({ request }) => {
  try {
    const { email, qrCodeUrl, activationCode } = await request.json();

    if (!email || !qrCodeUrl || !activationCode) {
      throw new Error("Missing required fields for email.");
    }

    console.log("Preparing to send email to:", email);

    // Generate an access token
    const accessToken = await oAuth2Client.getAccessToken();

    if (accessToken.token) {
      console.log("Access token retrieved successfully.");
    } else {
      throw new Error("Failed to retrieve access token.");
    }

    // Configure Nodemailer with Gmail API
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER, // Use environment variable for email
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Email content
    const mailOptions = {
      from: `GLOBESIM <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your eSIM Activation Details",
      html: `
        <p>Dear Customer,</p>
        <p>Thank you for your purchase! Below are your eSIM activation details:</p>
        <p><strong>Activation Code:</strong> ${activationCode}</p>
        <p><strong>Scan the QR Code below to activate your eSIM:</strong></p>
        <img src="${qrCodeUrl}" alt="eSIM QR Code" style="max-width: 300px;" />
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>GLOBESIM</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    return json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};


