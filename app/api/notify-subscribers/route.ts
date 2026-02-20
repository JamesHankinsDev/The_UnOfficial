import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../lib/firebase/client";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Get all subscribers with email notifications enabled
    const subscribersRef = collection(firestore, "subscribers");
    const emailQuery = query(
      subscribersRef,
      where("subscribed", "==", true),
      where("email", "!=", null),
    );
    const emailSnapshot = await getDocs(emailQuery);

    const emailPromises: Promise<any>[] = [];
    const emailSubscribers: string[] = [];

    // Collect email subscribers
    emailSnapshot.forEach((doc) => {
      const subscriberData = doc.data();
      if (subscriberData.email) {
        emailSubscribers.push(subscriberData.email);
      }
    });


    // Send emails
    if (emailSubscribers.length > 0 && process.env.RESEND_API_KEY) {
      // Add UTM and attribution params
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const utm = `?utm_source=newsletter&utm_medium=email&utm_campaign=notify_subscribers&attribution=notify-subscribers`;
      const postUrl = `${baseUrl}/posts/${postSlug}${utm}`;
      const settingsUrl = `${baseUrl}/settings${utm}`;
      for (const email of emailSubscribers) {
        emailPromises.push(
          resend.emails.send({
            from: "The UnOfficial <notifications@the-un-official.com>",
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
                    <a href="${postUrl}" class="button">
                      Read Article
                    </a>
                  </div>
                  <div class="footer">
                    <p>You're receiving this because you subscribed to notifications.</p>
                    <p><a href="${settingsUrl}">Manage your notification preferences</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
          }),
        );
      }
    }

    // Wait for all email notifications to be sent
    const emailResults = await Promise.allSettled(emailPromises);

    const emailSuccessful = emailResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const emailFailed = emailResults.filter(
      (r) => r.status === "rejected",
    ).length;

    return NextResponse.json({
      message: "Notifications sent",
      email: {
        successful: emailSuccessful,
        failed: emailFailed,
        total: emailSubscribers.length,
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
