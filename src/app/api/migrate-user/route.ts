// app/api/migrate-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { migrateUserRecommendations, rearrangeUserRecommendations } from '../../../../scripts/migrateRecommendations'; // server-only
import { adminAuth } from '../../../../utils/firebaseAdmin';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    if (!user.uid || !user.email) {
      return NextResponse.json({ error: 'Missing uid or email' }, { status: 400 });
    }

    await migrateUserRecommendations(user);  // user = { uid, email }
    await rearrangeUserRecommendations(user);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Migration error:', err);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
