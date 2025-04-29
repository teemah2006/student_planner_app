import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../utils/firebase";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get only documents that belong to this user
    const q = query(
      collection(db, "recommendations"),
      where("email", "==", userEmail)
    );

    const snapshot = await getDocs(q);
    const recommendations: {[key: string]: string| object}[]  = [];

    snapshot.forEach((doc) => {
      recommendations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
