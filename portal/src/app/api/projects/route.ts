import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Project from '@/models/Project';
import Contractor from '@/models/Contractor';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Parse query params
    const { searchParams } = new URL(req.url);
    const lga = searchParams.get('lga');
    const sector = searchParams.get('sector');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    
    // Build query object
    const query: any = {};
    if (lga) query.lga = lga;
    if (sector) query.sector = sector;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } }
      ];
    }

    const totalCount = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const projects = await Project.find(query)
      .populate('contractorId', 'name contractorId')
      .skip(skip)
      .limit(limit)
      .lean();
      
    return NextResponse.json({ projects, totalPages, currentPage: page }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // In a real application, validate the role from JWT here to ensure only Admins can create
    
    const newProject = await Project.create({
      ...data,
      budgetAllocated: Number(data.budgetAllocated)
    });
    
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
