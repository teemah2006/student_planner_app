import { NextResponse } from 'next/server';
import curriculum from '@/data/primary1_nvc_clean.json';

// GET /api/curriculum
export async function GET(request) {
  return NextResponse.json(curriculum);
}
