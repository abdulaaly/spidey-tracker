import { NextResponse } from 'next/server';
import { INITIAL_EVENTS } from '@/data/initialData';

export async function GET() {
  return NextResponse.json({
    events: {
      global: INITIAL_EVENTS
    }
  });
}
