import { NextResponse } from 'next/server';
import { getAllBugsForExport } from '@/lib/db';

export async function GET() {
  try {
    const bugs = await getAllBugsForExport();
    return NextResponse.json(bugs);
  } catch (error) {
    console.error('Failed to export bugs:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
