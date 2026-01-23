import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../lib/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

/**
 * API Route: /api/subscribe
 * Adds or updates a subscriber in the 'subscribers' collection.
 * Expects: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }
    if (!firestore) {
      return NextResponse.json(
        { error: "Database not configured." },
        { status: 500 },
      );
    }
    // Normalize email for case-insensitive match
    const normalizedEmail = email.trim().toLowerCase();
    const subscribersRef = collection(firestore, "subscribers");
    // Query for existing subscriber by normalized email
    const q = query(subscribersRef, where("normalizedEmail", "==", normalizedEmail));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Already subscribed, update to ensure 'subscribed: true'
      const docId = snapshot.docs[0].id;
      await setDoc(
        doc(subscribersRef, docId),
        { email, normalizedEmail, subscribed: true },
        { merge: true },
      );
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 400 });
    } else {
      // New subscriber
      const newDoc = doc(subscribersRef);
      await setDoc(newDoc, { email, normalizedEmail, subscribed: true });
      return NextResponse.json({ message: "Subscribed successfully!" });
    }
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Subscription failed." },
      { status: 500 },
    );
  }
}
