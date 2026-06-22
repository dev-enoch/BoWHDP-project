import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Contractor from '@/models/Contractor';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const updatedContractor = await Contractor.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedContractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ contractor: updatedContractor }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
