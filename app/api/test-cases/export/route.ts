import { NextResponse } from 'next/server';
import { getAllTestCasesForExport } from '@/lib/db';

export async function GET() {
  try {
    const testCases = await getAllTestCasesForExport();
    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Failed to export test cases:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
