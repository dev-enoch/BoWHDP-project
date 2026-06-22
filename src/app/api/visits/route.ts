import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import SiteVisit from '@/models/SiteVisit';
import Project from '@/models/Project';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { projectId, engineerName, reportNotes, qualityRating, coordinates, photoUrls } = body;

    // Validate Project Exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!coordinates || coordinates.length !== 2) {
      return NextResponse.json({ error: 'Valid GPS coordinates are required' }, { status: 400 });
    }

    const visit = await SiteVisit.create({
      projectId,
      engineerName,
      reportNotes,
      qualityRating,
      coordinates,
      photoUrls: photoUrls || []
    });

    return NextResponse.json({ message: 'Field report submitted successfully', visitId: visit.visitId }, { status: 201 });
  } catch (error: any) {
    console.error("API /api/visits error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const visits = await SiteVisit.find().populate('projectId', 'title projectId').sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ data: visits }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
