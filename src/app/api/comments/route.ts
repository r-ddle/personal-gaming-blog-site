import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Test database connection first
    await prisma.$connect();
    
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json({ 
          error: 'Database connection failed. Please check DATABASE_URL configuration.',
          details: error.message 
        }, { status: 500 });
      }
      if (error.message.includes('table') || error.message.includes('relation')) {
        return NextResponse.json({ 
          error: 'Database table not found. Please run database migrations.',
          details: error.message 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch comments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.username || !data.content || !data.postId) {
      return NextResponse.json({ error: 'Username, content, and postId are required' }, { status: 400 });
    }

    // Simple content validation
    if (data.content.length > 1000) {
      return NextResponse.json({ error: 'Comment too long (max 1000 characters)' }, { status: 400 });
    }

    if (data.username.length > 50) {
      return NextResponse.json({ error: 'Username too long (max 50 characters)' }, { status: 400 });
    }

    // Test database connection first
    await prisma.$connect();
    
    // Verify the post exists
    const postExists = await prisma.gamePost.findUnique({
      where: { id: data.postId }
    });
    
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        username: data.username.trim(),
        content: data.content.trim(),
        postId: data.postId
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json({ 
          error: 'Database connection failed. Please check DATABASE_URL configuration.',
          details: error.message 
        }, { status: 500 });
      }
      if (error.message.includes('foreign key') || error.message.includes('constraint')) {
        return NextResponse.json({ 
          error: 'Invalid post ID or database constraint violation',
          details: error.message 
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to create comment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    await prisma.comment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}