import { NextResponse } from 'next/server';
import { getAllImprovementsForExport } from '@/lib/db';

export async function GET() {
  try {
    const improvements = await getAllImprovementsForExport();
    return NextResponse.json(improvements);
  } catch (error) {
    console.error('Failed to export improvements:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
