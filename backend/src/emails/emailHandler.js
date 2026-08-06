import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeEmail = async (userEmail, userName, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: sender.email,
    to: userEmail,
    subject: "Welcome to My Chat App!",
    html: createWelcomeEmailTemplate(userName, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
  
  console.log("Welcome email sent successfully:", data);
};
