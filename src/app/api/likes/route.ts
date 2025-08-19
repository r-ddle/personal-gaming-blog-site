import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Check if this user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userAgent: {
          postId,
          userAgent
        }
      }
    });

    if (existingLike) {
      // Unlike (remove like)
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      
      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId }
      });

      return NextResponse.json({ 
        liked: false, 
        likeCount 
      });
    } else {
      // Like (add like)
      await prisma.like.create({
        data: {
          postId,
          userAgent,
          ipAddress
        }
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId }
      });

      return NextResponse.json({ 
        liked: true, 
        likeCount 
      });
    }
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json({ error: 'Failed to handle like' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Get like count for this post
    const likeCount = await prisma.like.count({
      where: { postId }
    });

    // Check if current user liked this post
    const userLike = await prisma.like.findUnique({
      where: {
        postId_userAgent: {
          postId,
          userAgent
        }
      }
    });

    return NextResponse.json({
      likeCount,
      liked: !!userLike
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}