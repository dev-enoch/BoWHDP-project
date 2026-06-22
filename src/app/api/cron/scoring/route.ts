import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Contractor from '@/models/Contractor';
import Project from '@/models/Project';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth check: Ensure the request comes from an authorized cron scheduler
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const contractors = await Contractor.find({});
    
    for (const contractor of contractors) {
      const projects = await Project.find({ contractorId: contractor._id });
      
      let newScore = contractor.overallScore; // Keep existing if no logic override
      let newStatus = 'Active';
      
      // Calculate composite score based on projects timeline status
      if (projects.length > 0) {
        const onTrack = projects.filter(p => p.status === 'On Track' || p.status === 'Completed').length;
        // If 100% on track, score trends towards 100.
        newScore = Math.round((onTrack / projects.length) * 100);
      }
      
      if (newScore < 60) newStatus = 'Warning';
      if (newScore < 40) newStatus = 'Blacklisted';
      if (newScore >= 60) newStatus = 'Active';
      
      contractor.overallScore = newScore;
      contractor.status = newStatus;
      contractor.activeProjects = projects.filter(p => p.status !== 'Completed').length;
      
      await contractor.save();
    }
    
    return NextResponse.json({ message: 'Contractor scorecards recalculated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
