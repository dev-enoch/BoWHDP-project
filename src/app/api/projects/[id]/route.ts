import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Project from '@/models/Project';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      {
        ...data,
        budgetAllocated: Number(data.budgetAllocated),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
