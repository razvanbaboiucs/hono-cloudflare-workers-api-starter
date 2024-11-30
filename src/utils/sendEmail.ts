import { HTTPException } from "hono/http-exception";
import { AppContext } from "../types/appContext";

export const sendEmailBrevo = async (
  clientEmail: string,
  from: string,
  subject: string,
  html: string,
  c: AppContext
) => {
  const url = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: {
      email: from,
    },
    to: [
      {
        email: clientEmail
      }
      // add more recipients if needed
    ],
    subject: subject,
    htmlContent: html,
  };

  console.info("Sending email to:", emailData.to);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": c.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      console.error(
        "Error sending email:",
        response.status,
        response.statusText
      );
      throw new HTTPException(500, { message: "Error sending email" });
    }

    const responseData = await response.json();
    console.info("Email sent successfully:", responseData);
  } catch (error) {
    if (!(error instanceof HTTPException)) {
      console.error("Error sending email:", error);
      throw new HTTPException(500, { message: "Error sending email" });
    }
    throw error;
  }
};
