import { NextResponse } from 'next/server';
import { getAllServicesForExport } from '@/lib/db';

export async function GET() {
  try {
    const services = await getAllServicesForExport();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to export services:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
