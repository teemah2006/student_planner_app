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
    const { link: linkToDelete, recommendationId } = body;
    console.log('recoid', recommendationId, linkToDelete)

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

        const snapshot = await recRef.get()
     
        if (!snapshot.exists) {
            return NextResponse.json({ error: "No existing recommendation" }, { status: 404 });
        }

        const data = snapshot.data();
        if (!data) {
            return NextResponse.json({ error: "No data found in recommendation" }, { status: 500 });
        }

        const newDoc: any = {};

        // Separate numeric (recommendation) and non-numeric (metadata) fields
        const recommendationEntries = Object.entries(data).filter(
            ([key]) => !isNaN(Number(key))
        );
        const metaFields = Object.entries(data).filter(
            ([key]) => isNaN(Number(key))
        );

        // 🔁 Replace this with the actual link you're trying to delete
        // const linkToDelete = "https://example.com"; // you can get this from req.body or wherever

        // Filter out the recommendation with the matching link
        const filteredRecommendations = recommendationEntries
            .map(([key, value]) => ({ key, value }))
            .filter(({ value }) => {
                const link =
                    typeof value === "object" && value !== null
                        ? (value as any).link || (value as any)?.mapValue?.fields?.link?.stringValue
                        : null;
                return link !== linkToDelete;
            });

        // Rebuild new doc with cleaned recommendations and original metadata
        metaFields.forEach(([key, value]) => {
            newDoc[key] = value;
        });
        filteredRecommendations.forEach(({ value }, index) => {
            newDoc[index] = value;
        });

        // 📝 Update the document
        await recRef.set(newDoc, { merge: false });

        // return NextResponse.json({ success: true }, { status: 200 });



        // await recRef.delete();

        return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Delete error:", err);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
