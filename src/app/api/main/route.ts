import { NextResponse } from 'next/server';
import { INITIAL_PINS, INITIAL_VILLAINS, INITIAL_VIDEOS } from '@/data/initialData';

export async function GET() {
  return NextResponse.json({
    spideyPins: INITIAL_PINS,
    webwatch: {
      articles: INITIAL_VILLAINS
    },
    videoGallery: {
      videos: INITIAL_VIDEOS
    }
  });
}
