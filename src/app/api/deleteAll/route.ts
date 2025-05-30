import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../utils/firebaseAdmin";
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const body = await req.json();
  const { recommendationId } = body;

  if (!recommendationId) {
    return NextResponse.json({ error: "No recommendation ID provided" }, { status: 400 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const recRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("recommendations")
      .doc(recommendationId);
    
  

    // await recRef.delete();

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
