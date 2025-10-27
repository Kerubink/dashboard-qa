import { NextResponse } from 'next/server';
import { getAllPerformanceForExport } from '@/lib/db';

export async function GET() {
  try {
    const performance = await getAllPerformanceForExport();
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Failed to export performance:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
