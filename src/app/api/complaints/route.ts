import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Complaint from '@/models/Complaint';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    // Simulate receiving webhook from Africa's Talking or WhatsApp
    
    // Default SLA deadline: 48 hours from now
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const complaint = await Complaint.create({
      citizenPhone: body.phoneNumber || body.from,
      message: body.text || body.message,
      source: body.source || 'Web',
      slaDeadline,
    });

    return NextResponse.json({ message: 'Complaint received', complaintId: complaint.complaintId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const complaints = await Complaint.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ complaints }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
