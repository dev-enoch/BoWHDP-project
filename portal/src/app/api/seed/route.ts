import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Contractor from '@/models/Contractor';
import Project from '@/models/Project';

const MOCK_CONTRACTORS = [
  { name: 'Al-Haqq Construction Ltd', email: 'contact@alhaqq.com.ng', phone: '08012345678', overallScore: 85, status: 'Active', projectsCompleted: 12, activeProjects: 2 },
  { name: 'Borno Builders Syndicate', email: 'info@bornobuilders.com', phone: '08123456789', overallScore: 92, status: 'Active', projectsCompleted: 8, activeProjects: 3 },
  { name: 'Kanem Engineering Co', email: 'projects@kanemeng.com', phone: '07034567890', overallScore: 45, status: 'Warning', projectsCompleted: 3, activeProjects: 1 },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await Contractor.deleteMany({});
    await Project.deleteMany({});

    // Seed Contractors
    const contractors = await Contractor.insertMany(MOCK_CONTRACTORS);

    const MOCK_PROJECTS = [
      {
        title: 'Bama-Banki Road Rehabilitation',
        lga: 'Bama',
        sector: 'Road',
        contractorId: contractors[0]._id,
        status: 'On Track',
        coordinates: [11.52, 13.68],
        budgetAllocated: 4500000000,
        progressPercentage: 65,
        startDate: new Date('2025-10-01'),
        estimatedCompletion: new Date('2026-12-01')
      },
      {
        title: 'Dikwa General Hospital Expansion',
        lga: 'Dikwa',
        sector: 'Public Building',
        contractorId: contractors[1]._id,
        status: 'On Track',
        coordinates: [12.03, 13.91],
        budgetAllocated: 1200000000,
        progressPercentage: 80,
        startDate: new Date('2025-05-15'),
        estimatedCompletion: new Date('2026-08-30')
      },
      {
        title: 'Gwoza Resettlement Housing (500 Units)',
        lga: 'Gwoza',
        sector: 'Housing',
        contractorId: contractors[2]._id,
        status: 'Delayed',
        coordinates: [11.08, 13.52],
        budgetAllocated: 8500000000,
        progressPercentage: 30,
        startDate: new Date('2025-01-10'),
        estimatedCompletion: new Date('2027-01-10')
      },
      {
        title: 'Maiduguri Flyover Project (Custom Area)',
        lga: 'Maiduguri',
        sector: 'Bridge',
        contractorId: contractors[1]._id,
        status: 'On Track',
        coordinates: [11.83, 13.15],
        budgetAllocated: 12500000000,
        progressPercentage: 95,
        startDate: new Date('2024-11-01'),
        estimatedCompletion: new Date('2026-07-01')
      }
    ];

    // Seed Projects
    await Project.insertMany(MOCK_PROJECTS);

    return NextResponse.json({ message: 'Database seeded successfully with custom short IDs' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
