import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { collection, query, where, getDocs } from "firebase/firestore";
import twilio from "twilio";
import { firestore } from "../../../lib/firebase/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

/**
 * Notification API Route
 *
 * Sends email and SMS notifications to all subscribed users when a new article is published.
 */

export async function POST(request: NextRequest) {
  try {
    const { postTitle, postSlug, authorName } = await request.json();

    if (!postTitle || !postSlug || !authorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    if (!firestore) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    // Get all users with email notifications enabled
    const usersRef = collection(firestore, "users");
    const emailQuery = query(
      usersRef,
      where("notificationPreferences.emailNotifications", "==", true),
    );
    const smsQuery = query(
      usersRef,
      where("notificationPreferences.smsNotifications", "==", true),
    );

    const [emailSnapshot, smsSnapshot] = await Promise.all([
      getDocs(emailQuery),
      getDocs(smsQuery),
    ]);

    const emailPromises: Promise<any>[] = [];
    const smsPromises: Promise<any>[] = [];
    const emailSubscribers: string[] = [];
    const smsSubscribers: string[] = [];

    // Collect email subscribers
    emailSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email) {
        emailSubscribers.push(userData.email);
      }
    });

    // Collect SMS subscribers
    smsSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (
        userData.notificationPreferences?.phoneNumber &&
        userData.notificationPreferences?.smsNotifications
      ) {
        smsSubscribers.push(userData.notificationPreferences.phoneNumber);
      }
    });

    // Send emails
    if (emailSubscribers.length > 0 && process.env.RESEND_API_KEY) {
      for (const email of emailSubscribers) {
        emailPromises.push(
          resend.emails.send({
            from: "The UnOfficial <notifications@theunofficial.blog>", // Update with your verified domain
            to: email,
            subject: `New Article: ${postTitle}`,
            html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                  .button { display: inline-block; background: #09BC8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Article Published!</h1>
                  </div>
                  <div class="content">
                    <h2>${postTitle}</h2>
                    <p>By ${authorName}</p>
                    <p>A new article has been published on The UnOfficial. Check it out now!</p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/posts/${postSlug}" class="button">
                      Read Article
                    </a>
                  </div>
                  <div class="footer">
                    <p>You're receiving this because you subscribed to notifications.</p>
                    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/settings">Manage your notification preferences</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
          }),
        );
      }
    }

    // Send SMS messages
    if (
      smsSubscribers.length > 0 &&
      twilioClient &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      for (const phoneNumber of smsSubscribers) {
        smsPromises.push(
          twilioClient.messages.create({
            body: `📰 New article published on The UnOfficial: "${postTitle}" by ${authorName}. Read now: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/posts/${postSlug}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
          }),
        );
      }
    }

    // Wait for all notifications to be sent
    const [emailResults, smsResults] = await Promise.all([
      Promise.allSettled(emailPromises),
      Promise.allSettled(smsPromises),
    ]);

    const emailSuccessful = emailResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const emailFailed = emailResults.filter(
      (r) => r.status === "rejected",
    ).length;
    const smsSuccessful = smsResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const smsFailed = smsResults.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      message: "Notifications sent",
      email: {
        successful: emailSuccessful,
        failed: emailFailed,
        total: emailSubscribers.length,
      },
      sms: {
        successful: smsSuccessful,
        failed: smsFailed,
        total: smsSubscribers.length,
      },
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      {
        error: `Failed to send notifications: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
