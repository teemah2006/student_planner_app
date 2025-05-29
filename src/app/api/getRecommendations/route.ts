/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../utils/firebaseAdmin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "uid not available" }, { status: 401 });
    }

    // ✅ Use adminDb here
    const recRef = adminDb.collection("users").doc(uid).collection("recommendations");
    const snapshot = await recRef.get();

    const recommendations: any[] = [];
    snapshot.forEach((doc) => {
      recommendations.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
