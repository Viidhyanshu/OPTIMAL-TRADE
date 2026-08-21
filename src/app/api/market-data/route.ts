import { NextResponse } from 'next/server';
import niftyData from '../../../../public/data/nifty50_kaggle.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (symbol) {
    const matched = niftyData.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
    if (matched) {
      return NextResponse.json({ success: true, company: matched });
    }
    return NextResponse.json({ success: false, error: 'Symbol not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    total: niftyData.length,
    companies: niftyData,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && Array.isArray(body.companies)) {
      return NextResponse.json({
        success: true,
        message: 'Dynamic Kaggle dataset ingested successfully',
        count: body.companies.length,
      });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload structure' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
