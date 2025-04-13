import { json } from "@remix-run/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const action = async ({ request }) => {
  try {
    const { email, qrCodeUrl, activationCode, uid } = await request.json();

    if (!email || !qrCodeUrl || !activationCode || !uid) {
      throw new Error("Missing required fields.");
    }

    await resend.emails.send({
      from: "GLOBESIM <onboarding@resend.dev>",
      to: email,
      subject: "Your eSIM Activation Details",
      html: `
        <p>Dear Customer,</p>
        <p>Thank you for your purchase! Below are your eSIM activation details:</p>
    
        <h3>QR Code Installation</h3>
        <ul>
          <li>Scan the <strong>QR code</strong> with the <strong>Camera</strong> app.</li>
          <li>Follow the prompts on screen to add a new Data Plan.</li>
        </ul>
    
        <h3>Apple iOS Devices</h3>
        <ul>
          <li>Go to <strong>Settings</strong> &gt; <strong>Cellular</strong> (Mobile or Mobile Service).</li>
          <li>Select the new eSIM plan under Cellular Data Plans.</li>
          <li>Set <strong>Data Roaming</strong> to <strong>ON</strong>.</li>
        </ul>
    
        <h3>Android Devices</h3>
        <ul>
          <li>Go to <strong>Settings</strong> &gt; <strong>Network and Internet</strong>.</li>
          <li>Turn on <strong>Data Roaming</strong>.</li>
          <li>Set the eSIM as the <strong>Mobile Data SIM</strong>.</li>
        </ul>
    
        <h3>Tips & Reminders</h3>
        <ul>
          <li>Set the eSIM as your <strong>cellular data plan</strong> when you arrive at your destination.</li>
          <li>Turn off <strong>Data Roaming</strong> on your <strong>main SIM card</strong> to avoid charges.</li>
          <li>Disable iCloud Sync, Google Photos, or other apps that use <strong>background data</strong>.</li>
        </ul>
    
        <p><strong>Your QR Code is attached to this email.</strong></p>
        <p>If you have any questions, contact our support team.</p>
        <p>Best regards,<br>GLOBESIM</p>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeUrl.split("base64,")[1],
          encoding: "base64",
          cid: "qrcode",
        },
      ],
    });


    return json({ success: true });
  } catch (err) {
    console.error("❌ Full Resend error:", err);
    return json({ error: err.message }, { status: 500 });
  }
};
