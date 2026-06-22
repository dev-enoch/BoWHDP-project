import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Contractor from '@/models/Contractor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    await dbConnect();
    
    const total = await Contractor.countDocuments({});
    const contractors = await Contractor.find({}).skip(skip).limit(limit).lean();
    
    return NextResponse.json({ 
      contractors,
      totalPages: Math.ceil(total / limit),
      currentPage: page 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const newContractor = await Contractor.create(data);
    return NextResponse.json({ contractor: newContractor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
