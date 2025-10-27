import { NextResponse } from 'next/server';
import { getAllTestsForExport } from '@/lib/db';

export async function GET() {
  try {
    const tests = await getAllTestsForExport();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to export tests:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
