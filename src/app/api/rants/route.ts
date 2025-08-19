import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rants = await prisma.quickRant.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(rants);
  } catch (error) {
    console.error('Error fetching rants:', error);
    return NextResponse.json({ error: 'Failed to fetch rants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const rant = await prisma.quickRant.create({
      data: {
        game: data.game,
        content: data.content,
        mood: data.mood
      }
    });

    return NextResponse.json(rant);
  } catch (error) {
    console.error('Error creating rant:', error);
    return NextResponse.json({ error: 'Failed to create rant' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rant ID required' }, { status: 400 });
    }

    await prisma.quickRant.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rant:', error);
    return NextResponse.json({ error: 'Failed to delete rant' }, { status: 500 });
  }
}