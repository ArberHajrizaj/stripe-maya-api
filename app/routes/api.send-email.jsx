import { json } from "@remix-run/node";
import nodemailer from "nodemailer";
import { google } from "googleapis";

// OAuth2 credentials
const CLIENT_ID =
  "1006300848230-ahqcmk2gh59jvfsr95e6o7hc73skkvt0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04hSVEUF0aUZMCgYIARAAGAQSNwF-L9IrkVCbpxOoPo6n_p0yKzc4DWy5SCgJXSUkwJfI0uJkN0Joj9b-2w2u51PsGNXKf1oR9uw";

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
    console.log("Access Token:", accessToken.token);
    if (accessToken.token) {
      console.log("Access token retrieved successfully:", accessToken.token);
    } else {
      throw new Error("Failed to retrieve access token.");
    }

    console.log("Access Token generated successfully:", accessToken.token);

    // Configure Nodemailer with Gmail API
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ahajrizaj666@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Email content
    const mailOptions = {
      from: "GLOBESIM <ahajrizaj666@gmail.com>",
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
