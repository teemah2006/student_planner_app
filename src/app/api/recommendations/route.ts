/* eslint-disable @typescript-eslint/no-explicit-any */
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
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const { link } = await req.json();

    const recsSnapshot = await adminDb
        .collection("users")
      .doc(uid)
      .collection("recommendations")
      .where("id", "==", recommendationId)
      .get();

    if (recsSnapshot.empty) {
      return NextResponse.json({ error: "No recommendations found" }, { status: 404 });
    }
    
    const docRef = recsSnapshot.docs[0].ref;
    const docData = recsSnapshot.docs[0].data();
    console.log(link)

    // Step 1: Extract only numeric keys
    const recommendationKeys = Object.keys(docData).filter((key) => !isNaN(Number(key)));
    const filteredRecs: any[] = recommendationKeys
      .map((key) => docData[key])
      .filter((rec) => rec.link !== link);

    // Step 2: Build new data object
    const newDocData: Record<string, any> = {};

    // Keep original metadata fields
    for (const key in docData) {
      if (isNaN(Number(key))) {
        newDocData[key] = docData[key];
      }
    }

    // Add back filtered recs with reset keys
    filteredRecs.forEach((rec, index) => {
      newDocData[index] = rec;
    });

    console.log("🟢 Filtered doc data to write:", newDocData);

    // Step 3: Overwrite the document
    await docRef.set(newDocData, { merge: false });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("🔴 Error in DELETE API:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}


// DELETE /api/recommendations

// export async function DELETE(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader?.split("Bearer ")[1];

//   if (!token) {
//     return NextResponse.json({ error: "No token provided" }, { status: 401 });
//   }

//   const body = await req.json();
//   const { recommendationId } = body;

//   if (!recommendationId) {
//     return NextResponse.json({ error: "No recommendation ID provided" }, { status: 400 });
//   }

//   try {
//     const decodedToken = await adminAuth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     const recSnapshot = adminDb
//       .collection("users")
//       .doc(uid)
//       .collection("recommendations")
//       .doc(recommendationId).get();
    
//    for (const doc of recSnapshot.docs) {
//   const docRef = doc.ref;
//   const docData = doc.data();
//   // filter/delete as needed
// }

//     await recRef.delete();

//     return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//   }
// }
